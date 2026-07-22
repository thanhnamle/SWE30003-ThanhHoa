using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartFM.Application.DTOs.Auth;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<AppUser> _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IRepository<AppUser> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var users = await _userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Email.ToLower() == request.Email.Trim().ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new BusinessRuleException("Email hoặc mật khẩu không đúng.");

        var token = GenerateJwtToken(user);
        return new AuthResponse(token, new UserDto(user.Id.ToString(), user.FullName, user.Email, user.Role));
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            throw new BusinessRuleException("Mật khẩu xác nhận không khớp.");

        if (request.Password.Length < 8)
            throw new BusinessRuleException("Mật khẩu phải có ít nhất 8 ký tự.");

        var users = await _userRepository.GetAllAsync();
        if (users.Any(u => u.Email.ToLower() == request.Email.Trim().ToLower()))
            throw new BusinessRuleException("Email này đã được đăng ký.");

        var newUser = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Customer",
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(newUser);

        var token = GenerateJwtToken(newUser);
        return new AuthResponse(token, new UserDto(newUser.Id.ToString(), newUser.FullName, newUser.Email, newUser.Role));
    }

    private string GenerateJwtToken(AppUser user)
    {
        var secret = _configuration["JWT:Secret"]
            ?? throw new InvalidOperationException("JWT:Secret not configured.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expirationMinutes = int.Parse(_configuration["JWT:ExpirationMinutes"] ?? "60");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:Issuer"],
            audience: _configuration["JWT:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
