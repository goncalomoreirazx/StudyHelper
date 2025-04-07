using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
        string GenerateRefreshToken();
        DateTime GetJwtExpiryTime();
        int? ValidateJwtToken(string token);
    }
}