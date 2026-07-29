using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Auth;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Exceptions;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>Login with email and password, returns JWT token</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (BusinessRuleException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>Register a new customer account</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (BusinessRuleException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
