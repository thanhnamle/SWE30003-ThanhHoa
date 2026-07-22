namespace SmartFM.Application.DTOs.Auth;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string FullName, string Email, string Password, string ConfirmPassword);

public record AuthResponse(string Token, UserDto User);

public record UserDto(string Id, string FullName, string Email, string Role);
