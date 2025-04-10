using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerAPI.DTOs;
using ServerAPI.Services;

namespace ServerAPI.Controllers
{
    [ApiController]
    [Route("api/subjects")]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectService _subjectService;
        private readonly ILogger<SubjectsController> _logger;

        public SubjectsController(ISubjectService subjectService, ILogger<SubjectsController> logger)
        {
            _subjectService = subjectService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<SubjectDto>>> GetAllSubjects()
        {
            try
            {
                var subjects = await _subjectService.GetAllSubjectsAsync();
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all subjects");
                return StatusCode(500, new { message = "An error occurred while retrieving subjects." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectDto>> GetSubjectById(int id)
        {
            try
            {
                var subject = await _subjectService.GetSubjectByIdAsync(id);
                if (subject == null)
                {
                    return NotFound(new { message = $"Subject with ID {id} not found." });
                }
                return Ok(subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subject by ID: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the subject." });
            }
        }

        [HttpGet("{id}/tutors")]
        public async Task<ActionResult<List<TutorDto>>> GetTutorsBySubject(int id)
        {
            try
            {
                // First check if the subject exists
                var subject = await _subjectService.GetSubjectByIdAsync(id);
                if (subject == null)
                {
                    return NotFound(new { message = $"Subject with ID {id} not found." });
                }

                var tutors = await _subjectService.GetTutorsBySubjectAsync(id);
                return Ok(tutors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tutors by subject ID: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving tutors.", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<SubjectDto>> CreateSubject(SubjectCreateRequest request)
        {
            try
            {
                var subject = await _subjectService.CreateSubjectAsync(request);
                return CreatedAtAction(nameof(GetSubjectById), new { id = subject.Id }, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating subject");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<SubjectDto>> UpdateSubject(int id, SubjectUpdateRequest request)
        {
            try
            {
                var subject = await _subjectService.UpdateSubjectAsync(id, request);
                if (subject == null)
                {
                    return NotFound(new { message = $"Subject with ID {id} not found." });
                }
                return Ok(subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating subject: {Id}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            try
            {
                var result = await _subjectService.DeleteSubjectAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Subject with ID {id} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting subject: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the subject." });
            }
        }
    }
}