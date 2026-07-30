using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using SmartFM.API.Middleware;
using SmartFM.Application;
using SmartFM.Infrastructure;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────
// Serilog
// ──────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// ──────────────────────────────────────────────
// CORS – allow Vite dev server
// ──────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        var origins = new List<string> { 
            "http://localhost:5173", 
            "http://localhost:4173", 
            "http://localhost:5174",
            "https://smartfm-psi.vercel.app" // Vercel production URL
        };
        var frontendUrl = builder.Configuration["FrontendUrl"];
        if (!string.IsNullOrWhiteSpace(frontendUrl))
        {
            origins.Add(frontendUrl);
        }

        policy
            .WithOrigins(origins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ──────────────────────────────────────────────
// Controllers + Swagger
// ──────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

// ──────────────────────────────────────────────
// Application + Infrastructure layers
// ──────────────────────────────────────────────
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ──────────────────────────────────────────────
// JWT Authentication
// ──────────────────────────────────────────────
var jwtSecret = builder.Configuration["JWT:Secret"]
    ?? throw new InvalidOperationException("JWT:Secret is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ──────────────────────────────────────────────
// HTTP Pipeline
// ──────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment() || builder.Configuration["EnableSwagger"] == "True")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must come BEFORE auth middleware
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SmartFM.Infrastructure.Persistence.SmartFmDbContext>();
    
    // Áp dụng các thay đổi cấu trúc bảng (Migrations) vào Database (cực kỳ quan trọng khi deploy lên DB mới)
    if (dbContext.Database.IsRelational())
    {
        dbContext.Database.Migrate();
    }

    if (dbContext.TransportOfferings.Count() < 4)
    {
        dbContext.TransportOfferings.AddRange(
            new SmartFM.Domain.Entities.TransportOffering { Id = Guid.NewGuid(), Name = "Express Freight", Category = SmartFM.Domain.Enums.TransportCategory.Express, MaxCapacityKg = 2000, BaseFee = 800000, FeePerKm = 25000, IsActive = true, CreatedAt = DateTime.UtcNow },
            new SmartFM.Domain.Entities.TransportOffering { Id = Guid.NewGuid(), Name = "Fragile Transport", Category = SmartFM.Domain.Enums.TransportCategory.Fragile, MaxCapacityKg = 1500, BaseFee = 1200000, FeePerKm = 30000, IsActive = true, CreatedAt = DateTime.UtcNow },
            new SmartFM.Domain.Entities.TransportOffering { Id = Guid.NewGuid(), Name = "Bulk Haulage", Category = SmartFM.Domain.Enums.TransportCategory.Bulk, MaxCapacityKg = 20000, BaseFee = 2000000, FeePerKm = 10000, IsActive = true, CreatedAt = DateTime.UtcNow }
        );
        dbContext.SaveChanges();
    }

    if (!dbContext.Invoices.Any())
    {
        var dummyCustomer = dbContext.Customers.FirstOrDefault();
        if (dummyCustomer == null)
        {
            dummyCustomer = new SmartFM.Domain.Entities.Customer { Id = Guid.NewGuid(), CompanyName = "Tech Corp", Name = "John Doe", Email = "john@techcorp.com", Phone = "0123456789", IsCorporateAccount = true, CreatedAt = DateTime.UtcNow };
            dbContext.Customers.Add(dummyCustomer);
            dbContext.SaveChanges();
        }

        var branch = dbContext.Branches.First();

        var dummyOrder1 = new SmartFM.Domain.Entities.Order { Id = Guid.NewGuid(), CustomerId = dummyCustomer.Id, BranchId = branch.Id, TransportOfferingId = dbContext.TransportOfferings.First().Id, CargoWeightKg = 100, CargoVolumeM3 = 5, Status = SmartFM.Domain.Enums.OrderStatus.Pending, CreatedAt = DateTime.UtcNow.AddDays(-2) };
        var dummyOrder2 = new SmartFM.Domain.Entities.Order { Id = Guid.NewGuid(), CustomerId = dummyCustomer.Id, BranchId = branch.Id, TransportOfferingId = dbContext.TransportOfferings.Skip(1).First().Id, CargoWeightKg = 200, CargoVolumeM3 = 10, Status = SmartFM.Domain.Enums.OrderStatus.Pending, CreatedAt = DateTime.UtcNow.AddDays(-1) };

        dbContext.Orders.AddRange(dummyOrder1, dummyOrder2);

        dbContext.Invoices.AddRange(
            new SmartFM.Domain.Entities.Invoice { Id = Guid.NewGuid(), OrderId = dummyOrder1.Id, Status = SmartFM.Domain.Enums.InvoiceStatus.Unpaid, Amount = 950000, IssuedAt = DateTime.UtcNow.AddDays(-2) },
            new SmartFM.Domain.Entities.Invoice { Id = Guid.NewGuid(), OrderId = dummyOrder2.Id, Status = SmartFM.Domain.Enums.InvoiceStatus.Unpaid, Amount = 1450000, IssuedAt = DateTime.UtcNow.AddDays(-1) }
        );

        dbContext.SaveChanges();
    }
}

app.Run();

public partial class Program { }
