using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AuthDbContext _context;

    public AdminController(AuthDbContext context)
    {
        _context = context;
    }

    // ✅ GET ALL USERS WITH PAGINATION
    [HttpGet("users")]
    public IActionResult GetAllUsers(int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.Users
            .Where(u => u.Role == "User" && !u.IsDeleted);

        var totalUsers = query.Count();

        var users = query
            .OrderBy(u => u.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                DepartmentName = _context.Departments
                    .Where(d => d.Id == u.DepartmentId)
                    .Select(d => d.DepartmentName)
                    .FirstOrDefault()
            })
            .ToList();

        return Ok(new
        {
            totalUsers,
            pageSize,
            users
        });
    }


    // ✅ GET USER BY ID (FOR EDIT) — EXCLUDES DELETED USERS
    [HttpGet("users/{id}")]
    public IActionResult GetUserById(int id)
    {
        var user = _context.Users
            .Where(u => u.Id == id && u.Role == "User" && !u.IsDeleted)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Address,
                u.PhoneNumber,
                u.DepartmentId
            })
            .FirstOrDefault();

        if (user == null)
            return NotFound("User not found");

        return Ok(user);
    }

    // ✅ UPDATE USER (ADMIN) — ONLY IF NOT DELETED
    [HttpPut("users/{id}")]
    public IActionResult UpdateUser(int id, AdminUpdateUserDto dto)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Id == id && u.Role == "User" && !u.IsDeleted);

        if (user == null)
            return NotFound("User not found");

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Address = dto.Address;
        user.PhoneNumber = dto.PhoneNumber;
        user.DepartmentId = dto.DepartmentId;

        _context.SaveChanges();

        return Ok("User updated successfully");
    }

    // 🔎 SEARCH USERS — EXCLUDES DELETED USERS
    [HttpGet("users/search")]
    public IActionResult SearchUsers(string? name, int? departmentId)
    {
        var query = _context.Users
            .Where(u => u.Role == "User" && !u.IsDeleted)
            .Join(
                _context.Departments,
                u => u.DepartmentId,
                d => d.Id,
                (u, d) => new UserListDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    DepartmentName = d.DepartmentName
                }
            );

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(u =>
                u.FullName.ToLower().Contains(name.ToLower()));
        }

        if (departmentId.HasValue)
        {
            query = query.Where(u =>
                _context.Users.Any(x =>
                    x.Id == u.Id &&
                    x.DepartmentId == departmentId &&
                    !x.IsDeleted));
        }

        return Ok(query.ToList());
    }

    // 🔤 AUTOCOMPLETE SUGGESTIONS — EXCLUDES DELETED USERS
    [HttpGet("users/suggestions")]
    public IActionResult GetUserSuggestions(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<string>());

        var names = _context.Users
            .Where(u => u.Role == "User" &&
                        !u.IsDeleted &&
                        u.FullName.ToLower().StartsWith(query.ToLower()))
            .Select(u => u.FullName)
            .Distinct()
            .Take(10)
            .ToList();

        return Ok(names);
    }

    // 🗑️ SOFT DELETE USER (ADMIN)
    [HttpDelete("users/{id}")]
    public IActionResult SoftDeleteUser(int id)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Id == id && u.Role == "User" && !u.IsDeleted);

        if (user == null)
            return NotFound("User not found");

        user.IsDeleted = true;
        _context.SaveChanges();

        return Ok("User deleted successfully");
    }
}
