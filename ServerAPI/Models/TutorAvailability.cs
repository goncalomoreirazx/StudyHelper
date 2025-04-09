using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class TutorAvailability
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsRecurring { get; set; } = true;  // Whether this is a recurring weekly slot
        public DateTime? SpecificDate { get; set; }    // For non-recurring availability
        
        // Navigation property
        [JsonIgnore]
        public Tutor Tutor { get; set; } = null!;
    }
}