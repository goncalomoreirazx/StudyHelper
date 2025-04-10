using Microsoft.EntityFrameworkCore;
using AutoMapper;
using ServerAPI.Data;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public class SessionService : ISessionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private const int SESSION_DURATION_MINUTES = 60; // Default session duration in minutes

        public SessionService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TutorSessionDto>> GetAllSessionsAsync()
        {
            var sessions = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .OrderByDescending(s => s.SessionDate)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            return _mapper.Map<List<TutorSessionDto>>(sessions);
        }

        public async Task<List<TutorSessionDto>> GetSessionsByStudentIdAsync(int studentId)
        {
            var sessions = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .Where(s => s.StudentId == studentId)
                .OrderByDescending(s => s.SessionDate)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            return _mapper.Map<List<TutorSessionDto>>(sessions);
        }

        public async Task<List<TutorSessionDto>> GetSessionsByTutorIdAsync(int tutorId)
        {
            var sessions = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .Where(s => s.TutorId == tutorId)
                .OrderByDescending(s => s.SessionDate)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            return _mapper.Map<List<TutorSessionDto>>(sessions);
        }

        public async Task<TutorSessionDto?> GetSessionByIdAsync(int id)
        {
            var session = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .FirstOrDefaultAsync(s => s.Id == id);

            return session != null ? _mapper.Map<TutorSessionDto>(session) : null;
        }

        public async Task<TutorSessionDto> CreateSessionAsync(int studentId, TutorSessionCreateRequest request)
        {
            // Parse times from string format
            var startTime = TimeSpan.Parse(request.StartTime);
            var endTime = TimeSpan.Parse(request.EndTime);

            // Check if tutor is available
            var isAvailable = await IsTutorAvailableAsync(
                request.TutorId, 
                request.SessionDate, 
                startTime, 
                endTime);

            if (!isAvailable)
            {
                throw new InvalidOperationException("The selected time slot is not available.");
            }

            // Create new session
            var session = new TutorSession
            {
                StudentId = studentId,
                TutorId = request.TutorId,
                SubjectId = request.SubjectId,
                SubSubjectId = request.SubSubjectId,
                SessionDate = request.SessionDate.Date,
                StartTime = startTime,
                EndTime = endTime,
                Status = SessionStatus.SCHEDULED,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.TutorSessions.Add(session);
            await _context.SaveChangesAsync();

            // Refresh session with included entities
            var createdSession = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .FirstOrDefaultAsync(s => s.Id == session.Id);

            return _mapper.Map<TutorSessionDto>(createdSession);
        }

        public async Task<TutorSessionDto?> UpdateSessionAsync(int id, TutorSessionUpdateRequest request)
        {
            var session = await _context.TutorSessions
                .Include(s => s.Student)
                .Include(s => s.Tutor)
                    .ThenInclude(t => t.User)
                .Include(s => s.Subject)
                .Include(s => s.SubSubject)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
            {
                return null;
            }

            // Update session properties if provided
            if (request.Status.HasValue)
                session.Status = request.Status.Value;

            if (!string.IsNullOrEmpty(request.Notes))
                session.Notes = request.Notes;

            session.UpdatedAt = DateTime.UtcNow;

            _context.TutorSessions.Update(session);
            await _context.SaveChangesAsync();

            return _mapper.Map<TutorSessionDto>(session);
        }

        public async Task<bool> DeleteSessionAsync(int id)
        {
            var session = await _context.TutorSessions.FindAsync(id);
            if (session == null)
            {
                return false;
            }

            _context.TutorSessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TutorAvailabilityDto>> GetTutorAvailabilityAsync(int tutorId)
        {
            var availabilities = await _context.TutorAvailabilities
                .Where(a => a.TutorId == tutorId)
                .ToListAsync();

            return _mapper.Map<List<TutorAvailabilityDto>>(availabilities);
        }

        public async Task<TutorAvailabilityDto> AddTutorAvailabilityAsync(TutorAvailabilityRequest request)
        {
            var startTime = TimeSpan.Parse(request.StartTime);
            var endTime = TimeSpan.Parse(request.EndTime);

            var availability = new TutorAvailability
            {
                TutorId = request.TutorId,
                DayOfWeek = request.DayOfWeek,
                StartTime = startTime,
                EndTime = endTime,
                IsRecurring = request.IsRecurring,
                SpecificDate = request.SpecificDate
            };

            _context.TutorAvailabilities.Add(availability);
            await _context.SaveChangesAsync();

            return _mapper.Map<TutorAvailabilityDto>(availability);
        }

        public async Task<bool> RemoveTutorAvailabilityAsync(int availabilityId)
        {
            var availability = await _context.TutorAvailabilities.FindAsync(availabilityId);
            if (availability == null)
            {
                return false;
            }

            _context.TutorAvailabilities.Remove(availability);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AvailableTimeSlotDto>> GetAvailableTimeSlotsAsync(int tutorId, DateTime date)
        {
            try
            {
                var dayOfWeek = date.DayOfWeek;
                var result = new List<AvailableTimeSlotDto>();

                // Get tutor's availabilities for the specified day of week or specific date
                var availabilities = await _context.TutorAvailabilities
                    .Where(a => a.TutorId == tutorId && 
                            ((a.IsRecurring && a.DayOfWeek == dayOfWeek) || 
                            (!a.IsRecurring && a.SpecificDate.HasValue && a.SpecificDate.Value.Date == date.Date)))
                    .ToListAsync();

                if (!availabilities.Any())
                {
                    // Return empty list if no availabilities found
                    return result;
                }

                // Get existing sessions for that tutor on that date
                var existingSessions = await _context.TutorSessions
                    .Where(s => s.TutorId == tutorId && 
                            s.SessionDate.Date == date.Date && 
                            s.Status != SessionStatus.CANCELLED)
                    .Select(s => new { s.StartTime, s.EndTime })
                    .ToListAsync();

                // Generate time slots at interval of SESSION_DURATION_MINUTES
                foreach (var availability in availabilities)
                {
                    var currentTime = availability.StartTime;
                    var SESSION_DURATION_MINUTES = 60; // Define this constant

                    while (currentTime.Add(TimeSpan.FromMinutes(SESSION_DURATION_MINUTES)) <= availability.EndTime)
                    {
                        var slotEndTime = currentTime.Add(TimeSpan.FromMinutes(SESSION_DURATION_MINUTES));
                        
                        // Check if slot overlaps with any existing session
                        bool isOverlapping = existingSessions.Any(s => 
                            (currentTime >= s.StartTime && currentTime < s.EndTime) ||
                            (slotEndTime > s.StartTime && slotEndTime <= s.EndTime) ||
                            (currentTime <= s.StartTime && slotEndTime >= s.EndTime));

                        if (!isOverlapping)
                        {
                            result.Add(new AvailableTimeSlotDto
                            {
                                Date = date,
                                StartTime = currentTime.ToString(@"hh\:mm"),
                                EndTime = slotEndTime.ToString(@"hh\:mm")
                            });
                        }

                        currentTime = currentTime.Add(TimeSpan.FromMinutes(SESSION_DURATION_MINUTES));
                    }
                }

                return result.OrderBy(s => TimeSpan.Parse(s.StartTime)).ToList();
            }
            catch (Exception ex)
            {
                // Log exception but return empty list instead of throwing
                Console.WriteLine($"Error in GetAvailableTimeSlotsAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return new List<AvailableTimeSlotDto>();
            }
        }

        // Helper method to check if tutor is available for a specific time
        private async Task<bool> IsTutorAvailableAsync(int tutorId, DateTime date, TimeSpan startTime, TimeSpan endTime)
        {
            var dayOfWeek = date.DayOfWeek;

            // Check if tutor has availability for this time slot
            var hasAvailability = await _context.TutorAvailabilities
                .AnyAsync(a => a.TutorId == tutorId && 
                            ((a.IsRecurring && a.DayOfWeek == dayOfWeek) || 
                             (!a.IsRecurring && a.SpecificDate.HasValue && a.SpecificDate.Value.Date == date.Date)) &&
                            a.StartTime <= startTime && 
                            a.EndTime >= endTime);

            if (!hasAvailability)
            {
                return false;
            }

            // Check if there's any overlapping session
            var hasOverlappingSession = await _context.TutorSessions
                .AnyAsync(s => s.TutorId == tutorId && 
                            s.SessionDate.Date == date.Date && 
                            s.Status != SessionStatus.CANCELLED &&
                            ((startTime >= s.StartTime && startTime < s.EndTime) ||
                             (endTime > s.StartTime && endTime <= s.EndTime) ||
                             (startTime <= s.StartTime && endTime >= s.EndTime)));

            return !hasOverlappingSession;
        }
    }
}