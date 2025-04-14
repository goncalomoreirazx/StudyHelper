using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Request DTOs
    public class TutorApplicationCreateRequest
    {
        public string Profession { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int Experience { get; set; }
        public List<string> Subjects { get; set; } = new List<string>();
        public string Bio { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
        public string? ContactPhone { get; set; }
    }

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
    }
    
    // Update status request
    public class ApplicationStatusUpdateRequest
    {
        [Required]
        public ApplicationStatus Status { get; set; }
        
        public string? ReviewNotes { get; set; }
    }
}