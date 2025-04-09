using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public class TutorService : ITutorService
    {
        private readonly ApplicationDbContext _context;

        public TutorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TutorDto>> GetAllTutorsAsync()
        {
            try
            {
                var tutors = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .ToListAsync();

                return tutors.Select(MapTutorToDto).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllTutorsAsync: {ex.Message}");
                return new List<TutorDto>();
            }
        }

        public async Task<TutorDto?> GetTutorByIdAsync(int id)
        {
            try
            {
                var tutor = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .FirstOrDefaultAsync(t => t.Id == id);

                return tutor != null ? MapTutorToDto(tutor) : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTutorByIdAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<List<TutorDto>> GetTutorsBySubjectAsync(string subject)
        {
            try
            {
                var tutors = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .Where(t => t.TutorSubjects.Any(s => s.Name.ToLower() == subject.ToLower()))
                    .ToListAsync();

                return tutors.Select(MapTutorToDto).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTutorsBySubjectAsync: {ex.Message}");
                return new List<TutorDto>();
            }
        }

        public async Task<(List<TutorDto> Tutors, int TotalCount)> GetPaginatedTutorsAsync(int page, int pageSize, string? subject = null)
        {
            try
            {
                // Start with basic query
                IQueryable<Tutor> query = _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies);

                // Apply subject filter if provided
                if (!string.IsNullOrEmpty(subject))
                {
                    query = query.Where(t => t.TutorSubjects.Any(s => s.Name.ToLower() == subject.ToLower()));
                }

                // Get total count
                var totalCount = await query.CountAsync();

                // Validate page
                if (page < 1) page = 1;
                
                // Apply pagination
                var tutors = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (tutors.Select(MapTutorToDto).ToList(), totalCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPaginatedTutorsAsync: {ex.Message}");
                return (new List<TutorDto>(), 0);
            }
        }

        public async Task<TutorDto> CreateTutorAsync(TutorCreateRequest request)
        {
            try
            {
                // Begin transaction
                using var transaction = await _context.Database.BeginTransactionAsync();
                
                // Get the user
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    throw new Exception($"User with ID {request.UserId} not found");
                }

                // Update user role to TUTOR if not already
                if (user.Role != UserRole.TUTOR)
                {
                    user.Role = UserRole.TUTOR;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                }

                // Create new tutor
                var tutor = new Tutor
                {
                    UserId = request.UserId,
                    Profession = request.Profession,
                    Bio = request.Bio,
                    Experience = request.Experience,
                    PhotoUrl = request.PhotoUrl ?? string.Empty,
                    Rating = 4.5 // Default rating
                };

                _context.Tutors.Add(tutor);
                await _context.SaveChangesAsync();

                // Add subjects
                foreach (var subject in request.Subjects)
                {
                    _context.TutorSubjects.Add(new TutorSubject
                    {
                        TutorId = tutor.Id,
                        Name = subject
                    });
                }

                // Add hobbies
                foreach (var hobby in request.Hobbies)
                {
                    _context.TutorHobbies.Add(new TutorHobby
                    {
                        TutorId = tutor.Id,
                        Name = hobby
                    });
                }

                await _context.SaveChangesAsync();
                
                // Commit transaction
                await transaction.CommitAsync();

                // Refresh tutor with related entities
                tutor = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .FirstOrDefaultAsync(t => t.Id == tutor.Id);

                return MapTutorToDto(tutor!);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateTutorAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<TutorDto?> UpdateTutorAsync(int id, TutorUpdateRequest request)
        {
            try
            {
                // Begin transaction
                using var transaction = await _context.Database.BeginTransactionAsync();
                
                var tutor = await _context.Tutors
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tutor == null)
                {
                    return null;
                }

                // Update properties if provided
                if (!string.IsNullOrEmpty(request.Profession))
                    tutor.Profession = request.Profession;

                if (!string.IsNullOrEmpty(request.Bio))
                    tutor.Bio = request.Bio;

                if (request.Experience.HasValue)
                    tutor.Experience = request.Experience.Value;

                if (!string.IsNullOrEmpty(request.PhotoUrl))
                    tutor.PhotoUrl = request.PhotoUrl;

                _context.Tutors.Update(tutor);
                await _context.SaveChangesAsync();

                // Update subjects if provided
                if (request.Subjects != null && request.Subjects.Any())
                {
                    // Remove existing subjects
                    _context.TutorSubjects.RemoveRange(tutor.TutorSubjects);
                    await _context.SaveChangesAsync();

                    // Add new subjects
                    foreach (var subject in request.Subjects)
                    {
                        _context.TutorSubjects.Add(new TutorSubject
                        {
                            TutorId = tutor.Id,
                            Name = subject
                        });
                    }
                    await _context.SaveChangesAsync();
                }

                // Update hobbies if provided
                if (request.Hobbies != null && request.Hobbies.Any())
                {
                    // Remove existing hobbies
                    _context.TutorHobbies.RemoveRange(tutor.TutorHobbies);
                    await _context.SaveChangesAsync();

                    // Add new hobbies
                    foreach (var hobby in request.Hobbies)
                    {
                        _context.TutorHobbies.Add(new TutorHobby
                        {
                            TutorId = tutor.Id,
                            Name = hobby
                        });
                    }
                    await _context.SaveChangesAsync();
                }
                
                // Commit transaction
                await transaction.CommitAsync();

                // Refresh tutor with related entities
                tutor = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .FirstOrDefaultAsync(t => t.Id == tutor.Id);

                return MapTutorToDto(tutor!);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateTutorAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteTutorAsync(int id)
        {
            try
            {
                var tutor = await _context.Tutors.FindAsync(id);
                if (tutor == null)
                {
                    return false;
                }

                _context.Tutors.Remove(tutor);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteTutorAsync: {ex.Message}");
                return false;
            }
        }

        // Helper method to map Tutor to TutorDTO
        private TutorDto MapTutorToDto(Tutor tutor)
        {
            return new TutorDto
            {
                Id = tutor.Id,
                UserId = tutor.UserId,
                Name = $"{tutor.User.FirstName} {tutor.User.LastName}",
                Email = tutor.User.Email,
                Profession = tutor.Profession,
                Bio = tutor.Bio,
                Experience = tutor.Experience,
                Rating = tutor.Rating,
                PhotoUrl = tutor.PhotoUrl,
                Subjects = tutor.TutorSubjects.Select(s => s.Name).ToList(),
                Hobbies = tutor.TutorHobbies.Select(h => h.Name).ToList()
            };
        }
    }
}