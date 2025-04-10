using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    public class Tutor
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Profession { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int Experience { get; set; } // Years of experience
        public double Rating { get; set; } = 4.5; // Default rating
        public string PhotoUrl { get; set; } = string.Empty;
        [NotMapped]
        public decimal HourlyRate { get; set; } = 50.00m; // Default hourly rate
        
        // Navigation properties
        [JsonIgnore]
        public User User { get; set; } = null!;
        
        public List<TutorSubject> TutorSubjects { get; set; } = new List<TutorSubject>();
        public List<TutorHobby> TutorHobbies { get; set; } = new List<TutorHobby>();
        
        // New navigation properties
        [JsonIgnore]
        public List<TutorAvailability> Availabilities { get; set; } = new List<TutorAvailability>();
        
        [JsonIgnore]
        public List<TutorSession> Sessions { get; set; } = new List<TutorSession>();
    }

    public class TutorSubject
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public string Name { get; set; } = string.Empty; // Subject name
        public int SubjectId { get; set; } = 1; // Default to Mathematics (ID 1)
        
        [JsonIgnore]
        public Tutor Tutor { get; set; } = null!;
        
        // Leave out the Subject property to avoid EF Core creating a shadow property
    }

    public class TutorHobby
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public string Name { get; set; } = string.Empty;
        
        [JsonIgnore]
        public Tutor Tutor { get; set; } = null!;
    }
}