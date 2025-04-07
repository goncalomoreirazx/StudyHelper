using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public int UserId { get; set; }
        
        [JsonIgnore]
        public User User { get; set; } = null!;
        
        public bool IsExpired => DateTime.UtcNow >= ExpiryDate;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}