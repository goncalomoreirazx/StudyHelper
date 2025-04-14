using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public interface ITutorApplicationService
    {
        Task<List<TutorApplicationDto>> GetAllApplicationsAsync(int userId, TutorApplicationCreateRequest request, string cvFilePath);
        Task<TutorApplicationDto?> GetApplicationByIdAsync(int id);
        Task<List<TutorApplicationDto>> GetApplicationsByUserIdAsync(int userId);
        Task<TutorApplicationDto> CreateApplicationAsync(int userId, TutorApplicationCreateRequest request, string cvFilePath);
        Task<TutorApplicationDto?> UpdateApplicationStatusAsync(int id, ApplicationStatusUpdateRequest request, int reviewerId);
    }
}