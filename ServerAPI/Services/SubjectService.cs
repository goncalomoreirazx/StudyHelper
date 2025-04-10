using Microsoft.EntityFrameworkCore;
using AutoMapper;
using ServerAPI.Data;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SubjectService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<SubjectDto>> GetAllSubjectsAsync()
        {
            var subjects = await _context.Subjects
                .Include(s => s.SubSubjects)
                .ToListAsync();

            return _mapper.Map<List<SubjectDto>>(subjects);
        }

        public async Task<SubjectDto?> GetSubjectByIdAsync(int id)
        {
            var subject = await _context.Subjects
                .Include(s => s.SubSubjects)
                .FirstOrDefaultAsync(s => s.Id == id);

            return subject != null ? _mapper.Map<SubjectDto>(subject) : null;
        }

        public async Task<SubjectDto> CreateSubjectAsync(SubjectCreateRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create the main subject
                var subject = new Subject
                {
                    Name = request.Name,
                    Description = request.Description,
                    Icon = request.Icon
                };

                _context.Subjects.Add(subject);
                await _context.SaveChangesAsync();

                // Add sub-subjects if provided
                if (request.SubSubjects != null && request.SubSubjects.Count > 0)
                {
                    foreach (var subSubjectName in request.SubSubjects)
                    {
                        var subSubject = new SubSubject
                        {
                            SubjectId = subject.Id,
                            Name = subSubjectName
                        };
                        _context.SubSubjects.Add(subSubject);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                // Refresh subject with sub-subjects
                var createdSubject = await _context.Subjects
                    .Include(s => s.SubSubjects)
                    .FirstOrDefaultAsync(s => s.Id == subject.Id);

                return _mapper.Map<SubjectDto>(createdSubject);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<SubjectDto?> UpdateSubjectAsync(int id, SubjectUpdateRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var subject = await _context.Subjects
                    .Include(s => s.SubSubjects)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (subject == null)
                {
                    return null;
                }

                // Update subject properties if provided
                if (!string.IsNullOrEmpty(request.Name))
                    subject.Name = request.Name;

                if (!string.IsNullOrEmpty(request.Description))
                    subject.Description = request.Description;

                if (!string.IsNullOrEmpty(request.Icon))
                    subject.Icon = request.Icon;

                _context.Subjects.Update(subject);
                await _context.SaveChangesAsync();

                // Update sub-subjects if provided
                if (request.SubSubjects != null && request.SubSubjects.Count > 0)
                {
                    // Remove existing sub-subjects
                    _context.SubSubjects.RemoveRange(subject.SubSubjects);
                    await _context.SaveChangesAsync();

                    // Add new sub-subjects
                    foreach (var subSubjectName in request.SubSubjects)
                    {
                        var subSubject = new SubSubject
                        {
                            SubjectId = subject.Id,
                            Name = subSubjectName
                        };
                        _context.SubSubjects.Add(subSubject);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                // Refresh subject with sub-subjects
                var updatedSubject = await _context.Subjects
                    .Include(s => s.SubSubjects)
                    .FirstOrDefaultAsync(s => s.Id == subject.Id);

                return _mapper.Map<SubjectDto>(updatedSubject);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return false;
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TutorDto>> GetTutorsBySubjectAsync(int subjectId)
        {
            try
            {
                // Get the subject first to verify it exists
                var subject = await _context.Subjects
                    .Include(s => s.SubSubjects)
                    .FirstOrDefaultAsync(s => s.Id == subjectId);
                
                if (subject == null)
                    return new List<TutorDto>();
                
                // Get all possible names that might match (including subject name and all subsubject names)
                var possibleNames = new List<string> { subject.Name };
                possibleNames.AddRange(subject.SubSubjects.Select(ss => ss.Name));
                
                // Query for tutors that teach any of these subjects by name
                var tutors = await _context.Tutors
                    .Include(t => t.User)
                    .Include(t => t.TutorSubjects)
                    .Include(t => t.TutorHobbies)
                    .Where(t => t.TutorSubjects.Any(ts => possibleNames.Contains(ts.Name)))
                    .ToListAsync();
                
                // Also check if any tutors teach directly by subject ID
                // This is for future compatibility when the proper relationship is established
                if (tutors.Count == 0)
                {
                    // This might not work unless there's a SubjectId column in TutorSubjects table
                    var tutorsBySubjectId = await _context.Tutors
                        .Include(t => t.User)
                        .Include(t => t.TutorSubjects)
                        .Include(t => t.TutorHobbies)
                        .Where(t => t.TutorSubjects.Any(ts => ts.SubjectId == subjectId))
                        .ToListAsync();
                    
                    if (tutorsBySubjectId.Any())
                    {
                        tutors.AddRange(tutorsBySubjectId);
                    }
                }

                return _mapper.Map<List<TutorDto>>(tutors);
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine($"Error in GetTutorsBySubjectAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                // Return empty list in case of error
                return new List<TutorDto>();
            }
        }
    }
}