using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerAPI.DTOs;
using ServerAPI.Services;
using System.Security.Claims;

namespace ServerAPI.Controllers
{
    [ApiController]
    [Route("api/tutor-applications")]
    [Authorize]
    public class TutorApplicationsController : ControllerBase
    {
        private readonly ITutorApplicationService _tutorApplicationService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<TutorApplicationsController> _logger;

        public TutorApplicationsController(
            ITutorApplicationService tutorApplicationService,
            IWebHostEnvironment environment,
            ILogger<TutorApplicationsController> logger)
        {
            _tutorApplicationService = tutorApplicationService;
            _environment = environment;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<List<TutorApplicationDto>>> GetAllApplications()
        {
            try
            {
                var applications = await _tutorApplicationService.GetAllApplicationsAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all tutor applications");
                return StatusCode(500, new { message = "An error occurred while retrieving applications." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TutorApplicationDto>> GetApplicationById(int id)
        {
            try
            {
                var application = await _tutorApplicationService.GetApplicationByIdAsync(id);
                if (application == null)
                {
                    return NotFound(new { message = $"Application with ID {id} not found." });
                }

                // Check if user has permission to view this application
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                string userRole = userRoleClaim?.Value ?? "";

                // Allow access if user is admin or the owner of the application
                if (userRole != "ADMIN" && application.UserId != userId)
                {
                    return Forbid();
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting application by ID: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the application." });
            }
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult<List<TutorApplicationDto>>> GetMyApplications()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);
                var applications = await _tutorApplicationService.GetApplicationsByUserIdAsync(userId);
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user's applications");
                return StatusCode(500, new { message = "An error occurred while retrieving applications." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TutorApplicationDto>> CreateApplication([FromForm] TutorApplicationCreateRequest request, IFormFile cvFile)
        {
            try
            {
                if (cvFile == null || cvFile.Length == 0)
                {
                    return BadRequest(new { message = "CV file is required." });
                }

                // Validate file type
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
                var fileExtension = Path.GetExtension(cvFile.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Invalid file type. Only PDF and Word documents are allowed." });
                }

                // Validate file size (5MB max)
                if (cvFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size exceeds the 5MB limit." });
                }

                // Get user ID from token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int userId = int.Parse(userIdClaim.Value);

                // Save the file
                var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", "cvs");
                Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists
                
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await cvFile.CopyToAsync(stream);
                }

                // Create the application
                var application = await _tutorApplicationService.CreateApplicationAsync(userId, request, fileName);
                return CreatedAtAction(nameof(GetApplicationById), new { id = application.Id }, application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tutor application");
                return StatusCode(500, new { message = "An error occurred while creating the application." });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<TutorApplicationDto>> UpdateApplicationStatus(int id, ApplicationStatusUpdateRequest request)
        {
            try
            {
                // Get reviewer ID from token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                int reviewerId = int.Parse(userIdClaim.Value);

                var application = await _tutorApplicationService.UpdateApplicationStatusAsync(id, request, reviewerId);
                if (application == null)
                {
                    return NotFound(new { message = $"Application with ID {id} not found." });
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating application status: {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the application status." });
            }
        }

        [HttpGet("download/{fileName}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DownloadCvFile(string fileName)
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "uploads", "cvs", fileName);
            
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File not found." });
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            
            string contentType;
            switch (extension)
            {
                case ".pdf":
                    contentType = "application/pdf";
                    break;
                case ".doc":
                    contentType = "application/msword";
                    break;
                case ".docx":
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                default:
                    contentType = "application/octet-stream";
                    break;
            }

            return File(fileBytes, contentType, fileName);
        }
    }
}