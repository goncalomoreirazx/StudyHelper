
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface ISessionService
    {
        Task<List<TutorSessionDto>> GetAllSessionsAsync();
        Task<List<TutorSessionDto>> GetSessionsByStudentIdAsync(int studentId);
        Task<List<TutorSessionDto>> GetSessionsByTutorIdAsync(int tutorId);
        Task<TutorSessionDto?> GetSessionByIdAsync(int id);
        Task<TutorSessionDto> CreateSessionAsync(int studentId, TutorSessionCreateRequest request);
        Task<TutorSessionDto?> UpdateSessionAsync(int id, TutorSessionUpdateRequest request);
        Task<bool> DeleteSessionAsync(int id);
        
        // Availability methods
        Task<List<TutorAvailabilityDto>> GetTutorAvailabilityAsync(int tutorId);
        Task<TutorAvailabilityDto> AddTutorAvailabilityAsync(TutorAvailabilityRequest request);
        Task<bool> RemoveTutorAvailabilityAsync(int availabilityId);
        Task<List<AvailableTimeSlotDto>> GetAvailableTimeSlotsAsync(int tutorId, DateTime date);
    }
}