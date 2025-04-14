using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class TutorApplication
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Profession { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int Experience { get; set; }
        public string Bio { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
        public string? ContactPhone { get; set; }
        public string CvFilePath { get; set; } = string.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.PENDING;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public int? ReviewedBy { get; set; }
        public string? ReviewNotes { get; set; }
        
        [JsonIgnore]
        public User User { get; set; } = null!;
        
        public List<TutorApplicationSubject> Subjects { get; set; } = new List<TutorApplicationSubject>();
    }

    public class TutorApplicationSubject
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public string Subject { get; set; } = string.Empty;
        
        [JsonIgnore]
        public TutorApplication Application { get; set; } = null!;
    }
    
    public enum ApplicationStatus
    {
        PENDING,
        APPROVED,
        REJECTED
    }
}