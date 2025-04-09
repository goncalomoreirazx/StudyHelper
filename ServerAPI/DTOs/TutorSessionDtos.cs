using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Response DTOs
    public class TutorSessionDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int TutorId { get; set; }
        public string TutorName { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int? SubSubjectId { get; set; }
        public string? SubSubjectName { get; set; }
        
        public DateTime SessionDate { get; set; }
        public string StartTime { get; set; } = string.Empty; // Formatted time (e.g., "10:00 AM")
        public string EndTime { get; set; } = string.Empty;   // Formatted time (e.g., "11:00 AM")
        
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
    }
    
    // Request DTOs
    public class TutorSessionCreateRequest
    {
        [Required]
        public int TutorId { get; set; }
        
        [Required]
        public int SubjectId { get; set; }
        
        public int? SubSubjectId { get; set; }
        
        [Required]
        public DateTime SessionDate { get; set; }
        
        [Required]
        public string StartTime { get; set; } = string.Empty; // In HH:mm format (24-hour)
        
        [Required]
        public string EndTime { get; set; } = string.Empty;   // In HH:mm format (24-hour)
        
        public string Notes { get; set; } = string.Empty;
    }

    public class TutorSessionUpdateRequest
    {
        public SessionStatus? Status { get; set; }
        public string? Notes { get; set; }
    }
    
    // Additional DTOs for availability
    public class TutorAvailabilityDto
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsRecurring { get; set; }
        public DateTime? SpecificDate { get; set; }
    }
    
    public class AvailableTimeSlotDto
    {
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }
    
    public class TutorAvailabilityRequest
    {
        [Required]
        public int TutorId { get; set; }
        
        [Required]
        public DayOfWeek DayOfWeek { get; set; }
        
        [Required]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        public string EndTime { get; set; } = string.Empty;
        
        public bool IsRecurring { get; set; } = true;
        
        public DateTime? SpecificDate { get; set; }
    }
}