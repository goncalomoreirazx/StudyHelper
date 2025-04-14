using Microsoft.EntityFrameworkCore;
using AutoMapper;
using ServerAPI.Data;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public class TutorApplicationService : ITutorApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TutorApplicationService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TutorApplicationDto>> GetAllApplicationsAsync()
        {
            var applications = await _context.TutorApplications
                .Include(a => a.User)
                .Include(a => a.Subjects)
                .OrderByDescending(a => a.SubmittedAt)
                .ToListAsync();

            return applications.Select(MapToDto).ToList();
        }

        public async Task<TutorApplicationDto?> GetApplicationByIdAsync(int id)
        {
            var application = await _context.TutorApplications
                .Include(a => a.User)
                .Include(a => a.Subjects)
                .FirstOrDefaultAsync(a => a.Id == id);

            return application != null ? MapToDto(application) : null;
        }

        public async Task<List<TutorApplicationDto>> GetApplicationsByUserIdAsync(int userId)
        {
            var applications = await _context.TutorApplications
                .Include(a => a.User)
                .Include(a => a.Subjects)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.SubmittedAt)
                .ToListAsync();

            return applications.Select(MapToDto).ToList();
        }

        public async Task<TutorApplicationDto> CreateApplicationAsync(int userId, TutorApplicationCreateRequest request, string cvFilePath)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                var application = new TutorApplication
                {
                    UserId = userId,
                    Profession = request.Profession,
                    Education = request.Education,
                    Experience = request.Experience,
                    Bio = request.Bio,
                    HourlyRate = request.HourlyRate,
                    Reason = request.Reason,
                    AdditionalInfo = request.AdditionalInfo,
                    ContactPhone = request.ContactPhone,
                    CvFilePath = cvFilePath,
                    Status = ApplicationStatus.PENDING,
                    SubmittedAt = DateTime.UtcNow
                };

                _context.TutorApplications.Add(application);
                await _context.SaveChangesAsync();

                // Add subjects
                foreach (var subject in request.Subjects)
                {
                    _context.TutorApplicationSubjects.Add(new TutorApplicationSubject
                    {
                        ApplicationId = application.Id,
                        Subject = subject
                    });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Refresh the application with its related data
                application = await _context.TutorApplications
                    .Include(a => a.User)
                    .Include(a => a.Subjects)
                    .FirstOrDefaultAsync(a => a.Id == application.Id);

                return MapToDto(application!);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<TutorApplicationDto?> UpdateApplicationStatusAsync(int id, ApplicationStatusUpdateRequest request, int reviewerId)
        {
            var application = await _context.TutorApplications
                .Include(a => a.User)
                .Include(a => a.Subjects)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return null;
            }

            application.Status = request.Status;
            application.ReviewedAt = DateTime.UtcNow;
            application.ReviewedBy = reviewerId;
            application.ReviewNotes = request.ReviewNotes;

            _context.TutorApplications.Update(application);
            await _context.SaveChangesAsync();

            // If application is approved, create a tutor profile
            if (request.Status == ApplicationStatus.APPROVED)
            {
                // Check if the user already has a tutor profile
                var existingTutor = await _context.Tutors.FirstOrDefaultAsync(t => t.UserId == application.UserId);
                
                if (existingTutor == null)
                {
                    // Create a new tutor profile
                    var tutor = new Tutor
                    {
                        UserId = application.UserId,
                        Profession = application.Profession,
                        Bio = application.Bio,
                        Experience = application.Experience,
                        HourlyRate = application.HourlyRate,
                        Rating = 4.5 // Default rating
                    };

                    _context.Tutors.Add(tutor);
                    await _context.SaveChangesAsync();

                    // Add subjects
                    foreach (var subjectObj in application.Subjects)
                    {
                        _context.TutorSubjects.Add(new TutorSubject
                        {
                            TutorId = tutor.Id,
                            Name = subjectObj.Subject
                        });
                    }

                    await _context.SaveChangesAsync();
                    
                    // Update user role
                    var user = await _context.Users.FindAsync(application.UserId);
                    if (user != null)
                    {
                        user.Role = UserRole.TUTOR;
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            return MapToDto(application);
        }

        // Helper method to map to DTO
        private TutorApplicationDto MapToDto(TutorApplication application)
        {
            return new TutorApplicationDto
            {
                Id = application.Id,
                UserId = application.UserId,
                UserName = $"{application.User.FirstName} {application.User.LastName}",
                Email = application.User.Email,
                Profession = application.Profession,
                Education = application.Education,
                Experience = application.Experience,
                Subjects = application.Subjects.Select(s => s.Subject).ToList(),
                Bio = application.Bio,
                HourlyRate = application.HourlyRate,
                Reason = application.Reason,
                AdditionalInfo = application.AdditionalInfo,
                ContactPhone = application.ContactPhone,
                CvFilePath = application.CvFilePath,
                Status = application.Status.ToString(),
                SubmittedAt = application.SubmittedAt,
                ReviewedAt = application.ReviewedAt,
                ReviewedBy = application.ReviewedBy,
                ReviewNotes = application.ReviewNotes
            };
        }
    }
}