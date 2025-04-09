using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerAPI.DTOs;
using ServerAPI.Services;

namespace ServerAPI.Controllers
{
    [ApiController]
    [Route("api/tutors")]
    public class TutorsController : ControllerBase
    {
        private readonly ITutorService _tutorService;
        private readonly ILogger<TutorsController> _logger;

        public TutorsController(ITutorService tutorService, ILogger<TutorsController> logger)
        {
            _tutorService = tutorService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<TutorDto>>> GetAllTutors()
        {
            try
            {
                var tutors = await _tutorService.GetAllTutorsAsync();
                return Ok(tutors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all tutors");
                return StatusCode(500, new { message = "An error occurred while retrieving tutors." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TutorDto>> GetTutorById(int id)
        {
            try
            {
                var tutor = await _tutorService.GetTutorByIdAsync(id);
                if (tutor == null)
                {
                    return NotFound(new { message = $"Tutor with ID {id} not found." });
                }
                return Ok(tutor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tutor by ID: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the tutor." });
            }
        }

        [HttpGet("subject/{subject}")]
        public async Task<ActionResult<List<TutorDto>>> GetTutorsBySubject(string subject)
        {
            try
            {
                var tutors = await _tutorService.GetTutorsBySubjectAsync(subject);
                return Ok(tutors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tutors by subject: {Subject}", subject);
                return StatusCode(500, new { message = "An error occurred while retrieving tutors." });
            }
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedResponse<TutorDto>>> GetPaginatedTutors(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] string? subject = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 50) pageSize = 50; // Limit maximum page size
                
                var (tutors, totalCount) = await _tutorService.GetPaginatedTutorsAsync(page, pageSize, subject);
                
                var response = new PaginatedResponse<TutorDto>
                {
                    Items = tutors,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paginated tutors");
                return StatusCode(500, new { message = "An error occurred while retrieving tutors." });
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<TutorDto>> CreateTutor(TutorCreateRequest request)
        {
            try
            {
                var tutor = await _tutorService.CreateTutorAsync(request);
                return CreatedAtAction(nameof(GetTutorById), new { id = tutor.Id }, tutor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tutor");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,TUTOR")]
        public async Task<ActionResult<TutorDto>> UpdateTutor(int id, TutorUpdateRequest request)
        {
            try
            {
                var tutor = await _tutorService.UpdateTutorAsync(id, request);
                if (tutor == null)
                {
                    return NotFound(new { message = $"Tutor with ID {id} not found." });
                }
                return Ok(tutor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tutor: {Id}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteTutor(int id)
        {
            try
            {
                var result = await _tutorService.DeleteTutorAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Tutor with ID {id} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tutor: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the tutor." });
            }
        }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}