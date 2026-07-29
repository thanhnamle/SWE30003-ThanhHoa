# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy the solution file and project files
COPY *.slnx ./
COPY src/SmartFM.API/*.csproj src/SmartFM.API/
COPY src/SmartFM.Application/*.csproj src/SmartFM.Application/
COPY src/SmartFM.Domain/*.csproj src/SmartFM.Domain/
COPY src/SmartFM.Infrastructure/*.csproj src/SmartFM.Infrastructure/
COPY src/SmartFM.Shared/*.csproj src/SmartFM.Shared/

# Restore dependencies
RUN dotnet restore src/SmartFM.API/SmartFM.API.csproj

# Copy the rest of the code
COPY . .

# Publish the app
RUN dotnet publish src/SmartFM.API/SmartFM.API.csproj -c Release -o /app/out

# Use the ASP.NET Core runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Render dynamically sets PORT env variable for web services
# ASP.NET Core 10 uses ASPNETCORE_URLS or relies on default 8080 if not set.
# Using PORT variable supplied by Render if any.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SmartFM.API.dll"]
