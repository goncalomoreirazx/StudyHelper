using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface ITutorService
    {
        Task<List<TutorDto>> GetAllTutorsAsync();
        Task<TutorDto?> GetTutorByIdAsync(int id);
        Task<List<TutorDto>> GetTutorsBySubjectAsync(string subject);
        Task<(List<TutorDto> Tutors, int TotalCount)> GetPaginatedTutorsAsync(int page, int pageSize, string? subject = null);
        Task<TutorDto> CreateTutorAsync(TutorCreateRequest request);
        Task<TutorDto?> UpdateTutorAsync(int id, TutorUpdateRequest request);
        Task<bool> DeleteTutorAsync(int id);
    }
}