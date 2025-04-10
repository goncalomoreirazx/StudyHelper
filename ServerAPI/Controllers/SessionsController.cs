using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerAPI.DTOs;
using ServerAPI.Services;
using System.Security.Claims;

namespace ServerAPI.Controllers
{
    [ApiController]
    [Route("api/sessions")]
    [Authorize]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly ILogger<SessionsController> _logger;

        public SessionsController(ISessionService sessionService, ILogger<SessionsController> logger)
        {
            _sessionService = sessionService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<List<TutorSessionDto>>> GetAllSessions()
        {
            try
            {
                var sessions = await _sessionService.GetAllSessionsAsync();
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sessions");
                return StatusCode(500, new { message = "An error occurred while retrieving sessions." });
            }
        }

        [HttpGet("my-sessions")]
        public async Task<ActionResult<List<TutorSessionDto>>> GetMyStudentSessions()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                var sessions = await _sessionService.GetSessionsByStudentIdAsync(userId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting student sessions");
                return StatusCode(500, new { message = "An error occurred while retrieving sessions." });
            }
        }

        [HttpGet("tutor-sessions")]
        [Authorize(Roles = "TUTOR,ADMIN")]
        public async Task<ActionResult<List<TutorSessionDto>>> GetMyTutorSessions()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                var sessions = await _sessionService.GetSessionsByTutorUserIdAsync(userId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tutor sessions");
                return StatusCode(500, new { message = "An error occurred while retrieving sessions." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TutorSessionDto>> GetSessionById(int id)
        {
            try
            {
                var session = await _sessionService.GetSessionByIdAsync(id);
                if (session == null)
                {
                    return NotFound(new { message = $"Session with ID {id} not found." });
                }

                // Check if user has permission to view this session
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                string userRole = userRoleClaim?.Value ?? "";

                // Allow access if user is admin, the student who booked, or the tutor
                if (userRole != "ADMIN" && session.StudentId != userId && session.TutorId != userId)
                {
                    return Forbid();
                }

                return Ok(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting session by ID: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the session." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TutorSessionDto>> CreateSession(TutorSessionCreateRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                var session = await _sessionService.CreateSessionAsync(userId, request);
                return CreatedAtAction(nameof(GetSessionById), new { id = session.Id }, session);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating session");
                return StatusCode(500, new { message = "An error occurred while creating the session." });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TutorSessionDto>> UpdateSession(int id, TutorSessionUpdateRequest request)
        {
            try
            {
                // Check if session exists and user has permission
                var existingSession = await _sessionService.GetSessionByIdAsync(id);
                if (existingSession == null)
                {
                    return NotFound(new { message = $"Session with ID {id} not found." });
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                string userRole = userRoleClaim?.Value ?? "";

                // Allow updates only for admin, the student who booked, or the tutor
                if (userRole != "ADMIN" && existingSession.StudentId != userId && existingSession.TutorId != userId)
                {
                    return Forbid();
                }

                var updatedSession = await _sessionService.UpdateSessionAsync(id, request);
                return Ok(updatedSession);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating session: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the session." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            try
            {
                // Check if session exists and user has permission
                var existingSession = await _sessionService.GetSessionByIdAsync(id);
                if (existingSession == null)
                {
                    return NotFound(new { message = $"Session with ID {id} not found." });
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                string userRole = userRoleClaim?.Value ?? "";

                // Allow deletion only for admin or the student who booked
                if (userRole != "ADMIN" && existingSession.StudentId != userId)
                {
                    return Forbid();
                }

                var result = await _sessionService.DeleteSessionAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting session: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the session." });
            }
        }

        // Tutor Availability Endpoints
        [HttpGet("tutors/{tutorId}/availability")]
        public async Task<ActionResult<List<TutorAvailabilityDto>>> GetTutorAvailability(int tutorId)
        {
            try
            {
                var availability = await _sessionService.GetTutorAvailabilityAsync(tutorId);
                return Ok(availability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tutor availability: {TutorId}", tutorId);
                return StatusCode(500, new { message = "An error occurred while retrieving availability." });
            }
        }

        [HttpGet("tutors/{tutorId}/available-slots")]
        public async Task<ActionResult<List<AvailableTimeSlotDto>>> GetAvailableTimeSlots(int tutorId, [FromQuery] DateTime date)
        {
            try
            {
                var availableSlots = await _sessionService.GetAvailableTimeSlotsAsync(tutorId, date);
                return Ok(availableSlots);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available time slots: {TutorId}, {Date}", tutorId, date);
                // Return an empty list instead of an error status
                return Ok(new List<AvailableTimeSlotDto>());
            }
        }

        [HttpPost("tutors/availability")]
        [Authorize(Roles = "TUTOR,ADMIN")]
        public async Task<ActionResult<TutorAvailabilityDto>> AddTutorAvailability(TutorAvailabilityRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                string userRole = userRoleClaim?.Value ?? "";

                // Allow only if user is admin or the tutor themselves
                if (userRole != "ADMIN" && request.TutorId != userId)
                {
                    return Forbid();
                }

                var availability = await _sessionService.AddTutorAvailabilityAsync(request);
                return Ok(availability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding tutor availability");
                return StatusCode(500, new { message = "An error occurred while adding availability." });
            }
        }

        [HttpDelete("tutors/availability/{availabilityId}")]
        [Authorize(Roles = "TUTOR,ADMIN")]
        public async Task<IActionResult> RemoveTutorAvailability(int availabilityId)
        {
            try
            {
                var result = await _sessionService.RemoveTutorAvailabilityAsync(availabilityId);
                if (!result)
                {
                    return NotFound(new { message = $"Availability with ID {availabilityId} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing tutor availability: {AvailabilityId}", availabilityId);
                return StatusCode(500, new { message = "An error occurred while removing availability." });
            }
        }
    }
}