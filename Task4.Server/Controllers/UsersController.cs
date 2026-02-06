using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task4.Server.Data;
using Task4.Server.Models;

namespace Task4.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.LastLoginTime)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.LastLoginTime,
                    u.RegistrationTime,
                    u.Status
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUsers([FromBody] List<Guid> userIds)
        {
            await UpdateUserStatus(userIds, "Blocked");
            return Ok(new { message = "Users blocked" });
        }

        [HttpPost("unblock")]
        public async Task<IActionResult> UnblockUsers([FromBody] List<Guid> userIds)
        {
            await UpdateUserStatus(userIds, "Active");
            return Ok(new { message = "Users unblocked" });
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteUsers([FromBody] List<Guid> userIds)
        {
            var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();
            _context.Users.RemoveRange(users);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Users deleted" });
        }

        [HttpPost("delete-unverified")]
        public async Task<IActionResult> DeleteUnverified()
        {
            var unverifiedUsers = await _context.Users
                .Where(u => u.Status == "Unverified")
                .ToListAsync();

            if (!unverifiedUsers.Any())
            {
                return Ok(new { message = "No unverified users found." });
            }

            _context.Users.RemoveRange(unverifiedUsers);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Deleted {unverifiedUsers.Count} unverified users." });
        }

        private async Task UpdateUserStatus(List<Guid> ids, string status)
        {
            var users = await _context.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
            foreach (var user in users)
            {
                user.Status = status;
            }
            await _context.SaveChangesAsync();
        }
    }
}