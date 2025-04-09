using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class TutorSession
    {
        public int Id { get; set; }
        public int StudentId { get; set; }  // References User.Id
        public int TutorId { get; set; }    // References Tutor.Id
        public int SubjectId { get; set; }  // References Subject.Id
        public int? SubSubjectId { get; set; }  // Optional references to SubSubject.Id
        
        public DateTime SessionDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        
        public SessionStatus Status { get; set; } = SessionStatus.SCHEDULED;
        public string Notes { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        [JsonIgnore]
        public User Student { get; set; } = null!;
        
        [JsonIgnore]
        public Tutor Tutor { get; set; } = null!;
        
        [JsonIgnore]
        public Subject Subject { get; set; } = null!;
        
        [JsonIgnore]
        public SubSubject? SubSubject { get; set; }
    }
    
    public enum SessionStatus
    {
        SCHEDULED = 0,
        COMPLETED = 1,
        CANCELLED = 2,
        NO_SHOW = 3
    }
}