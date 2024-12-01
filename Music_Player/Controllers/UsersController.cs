using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Music_Player.Models;
using System.Security.Cryptography;

namespace Music_Player.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MusicPlayerDbContext _context;

        public UsersController(MusicPlayerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser()
        {
            // Ensure the request is of the correct type
            if (!Request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid Content-Type. Expected 'multipart/form-data'");
            }

            // Parse form data
            var form = await Request.ReadFormAsync();

            // Access form fields
            var username = form["username"].ToString();
            var email = form["email"].ToString();
            var passwordHash = form["passwordHash"].ToString();

            // Check required fields
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(passwordHash))
            {
                return BadRequest("Missing required fields: username, email, or passwordHash");
            }

            // Access file (profile picture)
            var profilePicture = form.Files.FirstOrDefault();
            string profilePictureUrl = null;

            if (profilePicture != null)
            {
                // Save the uploaded file to the "uploads" folder
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid() + Path.GetExtension(profilePicture.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePicture.CopyToAsync(stream);
                }

                // Generate relative path for accessing the file
                profilePictureUrl = $"/uploads/{uniqueFileName}";
            }

            // Create the user object
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                ProfilePictureUrl = profilePictureUrl ?? "/uploads/default.jpg" // Fallback to default image if no file
            };

            // Add the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }



        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            var existingUser = _context.Users.Find(id);
            if (existingUser == null) return NotFound();

            existingUser.Username = user.Username;
            existingUser.PasswordHash = user.PasswordHash;
            existingUser.Email = user.Email;
            existingUser.ProfilePictureUrl = user.ProfilePictureUrl;
            existingUser.Playlists = user.Playlists;
            existingUser.LikedSongs = user.LikedSongs;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == request.Email && u.PasswordHash == request.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Generate a simple session token
            user.SessionToken = GenerateSessionToken();
            _context.SaveChanges();

            return Ok(new { SessionToken = user.SessionToken, UserId = user.Id, Username = user.Username });
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromHeader(Name = "Session-Token")] string sessionToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.SessionToken == sessionToken);
            if (user == null)
            {
                return Unauthorized("Invalid session.");
            }

            user.SessionToken = null; // Clear the session token
            _context.SaveChanges();

            return Ok("Logged out successfully.");
        }

        [HttpGet("profile")]
        public IActionResult GetUserProfile([FromHeader(Name = "Session-Token")] string sessionToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.SessionToken == sessionToken);
            if (user == null)
            {
                return Unauthorized("Invalid session.");
            }

            return Ok(user);
        }

        [HttpPost("{userId}/like-song")]
        public IActionResult LikeSong([FromRoute] int userId, [FromBody] int songId, [FromHeader(Name = "Session-Token")] string sessionToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.Id == userId && u.SessionToken == sessionToken);
            if (user == null)
            {
                return Unauthorized("Invalid session.");
            }

            if (!user.LikedSongs.Contains(songId))
            {
                user.LikedSongs.Add(songId);
                _context.SaveChanges();
            }

            return Ok("Song added to liked songs.");
        }

        private string GenerateSessionToken()
        {
            using (var cryptoProvider = new RNGCryptoServiceProvider())
            {
                var tokenBuffer = new byte[32];
                cryptoProvider.GetBytes(tokenBuffer);
                return Convert.ToBase64String(tokenBuffer);
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
