using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        
        public UserRole Role { get; set; } = UserRole.STUDENT;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }

    public enum UserRole
    {
        STUDENT,
        TUTOR,
        ADMIN
    }
}