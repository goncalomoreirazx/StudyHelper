using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Request DTOs
    public class TutorApplicationCreateRequest
    {
        [Required]
        public string Profession { get; set; } = string.Empty;
        
        [Required]
        public string Education { get; set; } = string.Empty;
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Experience { get; set; }
        
        [Required]
        public List<string> Subjects { get; set; } = new List<string>();
        
        [Required]
        [StringLength(500, MinimumLength = 100)]
        public string Bio { get; set; } = string.Empty;
        
        [Required]
        [Range(10, 200)]
        public decimal HourlyRate { get; set; }
        
        [Required]
        [StringLength(300, MinimumLength = 50)]
        public string Reason { get; set; } = string.Empty;
        
        public string? AdditionalInfo { get; set; }
        
        [RegularExpression(@"^[0-9\-\+\s\(\)]{7,20}$")]
        public string? ContactPhone { get; set; }
        
        // The CV file will be handled separately in the controller
    }

    // Response DTOs
    public class TutorApplicationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Profession { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int Experience { get; set; }
        public List<string> Subjects { get; set; } = new List<string>();
        public string Bio { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
        public string? ContactPhone { get; set; }
        public string CvFilePath { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public int? ReviewedBy { get; set; }
        public string? ReviewNotes { get; set; }
    }
    
    // Update status request
    public class ApplicationStatusUpdateRequest
    {
        [Required]
        public ApplicationStatus Status { get; set; }
        
        public string? ReviewNotes { get; set; }
    }
}