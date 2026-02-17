using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly JwtService _jwt;

        public AuthController(AuthDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // 🔐 LOGIN (BLOCKS SOFT-DELETED USERS)
        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == dto.Email && !u.IsDeleted);

            if (user == null)
                return Unauthorized("Invalid credentials or user deleted");

            bool isValid = BCrypt.Net.BCrypt.Verify(
                dto.Password, user.PasswordHash);

            if (!isValid)
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                token,
                role = user.Role
            });
        }

        // 👤 REGISTER USER (ADMIN ONLY)
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            // ❌ Block reusing email of deleted or active users
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                DepartmentId = dto.DepartmentId,
                Role = "User",
                IsDeleted = false // ✅ IMPORTANT
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User created successfully");
        }
    }
}
