using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Request DTOs
    public class RegisterRequest
    {
        [Required]
        [MinLength(2)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MinLength(2)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
            ErrorMessage = "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character")]
        public string Password { get; set; } = string.Empty;
        
        public UserRole Role { get; set; } = UserRole.STUDENT;
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class TokenRefreshRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }

    // Response DTOs
    public class AuthResponse
    {
        public UserDto User { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}