using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerAPI.DTOs;
using ServerAPI.Services;

namespace ServerAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(TokenRefreshRequest request)
        {
            try
            {
                var response = await _authService.RefreshTokenAsync(request.RefreshToken);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken(TokenRefreshRequest request)
        {
            // Accept token from request body or cookie
            var token = request.RefreshToken;
            
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });
            
            var result = await _authService.RevokeTokenAsync(token);
            
            if (!result)
                return NotFound(new { message = "Token not found" });
            
            return Ok(new { message = "Token revoked" });
        }
        
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                // Get user ID from JWT token claims
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "Invalid token" });
                
                var user = await _authService.GetCurrentUserAsync(int.Parse(userId));
                
                if (user == null)
                    return NotFound(new { message = "User not found" });
                
                return Ok(new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}