using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AuthService(
            IUserService userService,
            ITokenService tokenService,
            ApplicationDbContext context,
            IMapper mapper)
        {
            _userService = userService;
            _tokenService = tokenService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
           try{
            Console.WriteLine("Starting user registration");
            // Map RegisterRequest to User
            var user = _mapper.Map<User>(request);
            Console.WriteLine($"User mapped: {user.FirstName} {user.LastName}, {user.Email}");
            
            
            // Create user
            await _userService.CreateAsync(user, request.Password);
            Console.WriteLine("User Created sucessfully");
            
            // Generate tokens
            var jwtToken = _tokenService.GenerateJwtToken(user);
            var refreshToken = await CreateRefreshTokenForUser(user);
            
            // Return auth response
            return new AuthResponse
            {
                User = _mapper.Map<UserDto>(user),
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                ExpiresAt = _tokenService.GetJwtExpiryTime()
            };
           }
           catch (Exception ex)
            {
             Console.WriteLine($"Registration error: {ex.Message}");
             Console.WriteLine($"Stack trace: {ex.StackTrace}");
             throw;
            }   
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Find user by email
            var user = await _userService.GetByEmailAsync(request.Email);
            if (user == null)
                throw new Exception("Invalid email or password");
            
            // Verify password
            if (!_userService.VerifyPassword(request.Password, user.PasswordHash))
                throw new Exception("Invalid email or password");
            
            // Generate tokens
            var jwtToken = _tokenService.GenerateJwtToken(user);
            var refreshToken = await CreateRefreshTokenForUser(user);
            
            // Return auth response
            return new AuthResponse
            {
                User = _mapper.Map<UserDto>(user),
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                ExpiresAt = _tokenService.GetJwtExpiryTime()
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            // Find refresh token in database
            var storedToken = await _context.RefreshTokens
                .Include(r => r.User)
                .SingleOrDefaultAsync(r => r.Token == refreshToken);
            
            if (storedToken == null)
                throw new Exception("Invalid refresh token");
            
            // Check if token is active
            if (!storedToken.IsActive)
                throw new Exception("Inactive refresh token");
            
            // Revoke the current refresh token
            storedToken.IsRevoked = true;
            _context.RefreshTokens.Update(storedToken);
            
            // Generate new tokens
            var user = storedToken.User;
            var newJwtToken = _tokenService.GenerateJwtToken(user);
            var newRefreshToken = await CreateRefreshTokenForUser(user);
            
            await _context.SaveChangesAsync();
            
            // Return auth response
            return new AuthResponse
            {
                User = _mapper.Map<UserDto>(user),
                Token = newJwtToken,
                RefreshToken = newRefreshToken.Token,
                ExpiresAt = _tokenService.GetJwtExpiryTime()
            };
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .SingleOrDefaultAsync(r => r.Token == refreshToken);
            
            if (storedToken == null)
                return false;
            
            if (!storedToken.IsActive)
                return false;
            
            storedToken.IsRevoked = true;
            _context.RefreshTokens.Update(storedToken);
            
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<User?> GetCurrentUserAsync(int userId)
        {
            return await _userService.GetByIdAsync(userId);
        }
        
        // Helper methods
        private async Task<RefreshToken> CreateRefreshTokenForUser(User user)
        {
            var refreshToken = new RefreshToken
            {
                Token = _tokenService.GenerateRefreshToken(),
                ExpiryDate = DateTime.UtcNow.AddDays(7), // Refresh token valid for 7 days
                UserId = user.Id
            };
            
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            
            return refreshToken;
        }
    }
}