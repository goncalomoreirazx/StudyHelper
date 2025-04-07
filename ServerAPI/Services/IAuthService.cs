using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
        Task<User?> GetCurrentUserAsync(int userId);
    }
}