using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface ISubjectService
    {
        Task<List<SubjectDto>> GetAllSubjectsAsync();
        Task<SubjectDto?> GetSubjectByIdAsync(int id);
        Task<SubjectDto> CreateSubjectAsync(SubjectCreateRequest request);
        Task<SubjectDto?> UpdateSubjectAsync(int id, SubjectUpdateRequest request);
        Task<bool> DeleteSubjectAsync(int id);
        Task<List<TutorDto>> GetTutorsBySubjectAsync(int subjectId);
    }
}