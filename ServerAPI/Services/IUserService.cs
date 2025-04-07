using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user, string password);
        Task<bool> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
        bool VerifyPassword(string password, string passwordHash);
    }
}