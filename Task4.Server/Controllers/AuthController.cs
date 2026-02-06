using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task4.Server.Data;
using Task4.Server.Models;
using BCrypt.Net;

namespace Task4.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // [FIX 1] Declare the context field here so the rest of the class can see it
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1. Check if user exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "This email is already taken." });
            }

            // 2. Create the User Object
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Status = "Unverified",
                LastLoginTime = DateTime.UtcNow,
                RegistrationTime = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // [FIX 2] Generate the link AFTER the user is created
            // [FIX 3] Use the environment variable so it works on Azure (and Localhost)
            var clientUrl = _configuration["AppSettings:ClientUrl"];
            var verifyLink = $"{clientUrl}/verify?email={user.Email}";

            Console.WriteLine("\n==============================================");
            Console.WriteLine($"FAKE EMAIL SENT TO: {user.Email}");
            Console.WriteLine($"VERIFY LINK: {verifyLink}");
            Console.WriteLine("==============================================\n");

            return Ok(new { message = "Registration successful", userId = user.Id });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return BadRequest(new { message = "User not found." });

            user.Status = "Active";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account verified successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            if (user.Status == "Blocked")
            {
                return Unauthorized(new { message = "Your account is blocked." });
            }

            user.LastLoginTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { token = "dummy-token-" + user.Id, user = new { user.Id, user.Name, user.Email, user.Status } });
        }
    }

    public class RegisterDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}