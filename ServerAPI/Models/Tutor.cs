using System.Text.Json.Serialization;

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
        
        // Navigation properties
        [JsonIgnore]
        public User User { get; set; } = null!;
        public List<TutorSubject> TutorSubjects { get; set; } = new List<TutorSubject>();
        public List<TutorHobby> TutorHobbies { get; set; } = new List<TutorHobby>();
    }

    public class TutorSubject
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public string Name { get; set; } = string.Empty;
        
        [JsonIgnore]
        public Tutor Tutor { get; set; } = null!;
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