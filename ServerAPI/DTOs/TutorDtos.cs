using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Response DTOs
    public class TutorDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;  // Combined first and last name
        public string Email { get; set; } = string.Empty;
        public string Profession { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int Experience { get; set; }
        public double Rating { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
        public List<string> Subjects { get; set; } = new List<string>();
        public List<string> Hobbies { get; set; } = new List<string>();
    }

    // Request DTOs
    public class TutorCreateRequest
    {
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public string Profession { get; set; } = string.Empty;
        
        [Required]
        public string Bio { get; set; } = string.Empty;
        
        [Required]
        public int Experience { get; set; }
        
        public string? PhotoUrl { get; set; }
        
        [Required]
        public List<string> Subjects { get; set; } = new List<string>();
        
        [Required]
        public List<string> Hobbies { get; set; } = new List<string>();
    }

    public class TutorUpdateRequest
    {
        public string? Profession { get; set; }
        public string? Bio { get; set; }
        public int? Experience { get; set; }
        public string? PhotoUrl { get; set; }
        public List<string>? Subjects { get; set; }
        public List<string>? Hobbies { get; set; }
    }
}