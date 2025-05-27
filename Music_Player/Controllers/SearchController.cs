using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_Player.Models;
using System.Linq;

namespace Music_Player.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly MusicPlayerDbContext _context;

        public SearchController(MusicPlayerDbContext context)
        {
            _context = context;
        }

        // Search for songs, albums, or artists based on the query
        [HttpGet]
        public IActionResult Search([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Search query is required");
            }

            var songs = _context.Songs
                .Where(s => s.Name.Contains(query) || s.Singer.Contains(query) || s.Genre.Contains(query))
                .ToList();

            // You can modify this query to search for albums or other related models as needed
            return Ok(songs);
        }
    }
}
