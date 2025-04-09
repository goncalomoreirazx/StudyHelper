using System.ComponentModel.DataAnnotations;
using ServerAPI.Models;

namespace ServerAPI.DTOs
{
    // Response DTOs
    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public List<SubSubjectDto> SubSubjects { get; set; } = new List<SubSubjectDto>();
    }

    public class SubSubjectDto
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
    
    // Request DTOs
    public class SubjectCreateRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public string Icon { get; set; } = string.Empty;
        
        public List<string> SubSubjects { get; set; } = new List<string>();
    }

    public class SubjectUpdateRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public List<string>? SubSubjects { get; set; }
    }
}