
using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty; // For displaying an icon/emoji
        
        // Navigation properties
        public List<SubSubject> SubSubjects { get; set; } = new List<SubSubject>();
        
        [JsonIgnore]
        public List<TutorSubject> TutorSubjects { get; set; } = new List<TutorSubject>();
    }

    public class SubSubject
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        
        [JsonIgnore]
        public Subject Subject { get; set; } = null!;
    }
}