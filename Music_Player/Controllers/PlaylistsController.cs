using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Music_Player.Models;

namespace Music_Player.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        private readonly MusicPlayerDbContext _context;

        public PlaylistsController(MusicPlayerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllPlaylists()
        {
            var playlists = _context.Playlists.ToList();
            return Ok(playlists);
        }

        [HttpGet("{id}")]
        public IActionResult GetPlaylistById(int id)
        {
            var playlist = _context.Playlists.Find(id);
            if (playlist == null) return NotFound();
            return Ok(playlist);
        }

        [HttpPost]
        public IActionResult CreatePlaylist([FromBody] Playlist playlist)
        {
            _context.Playlists.Add(playlist);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.Id }, playlist);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePlaylist(int id, [FromBody] Playlist playlist)
        {
            var existingPlaylist = _context.Playlists.Find(id);
            if (existingPlaylist == null) return NotFound();

            existingPlaylist.Name = playlist.Name;
            existingPlaylist.UserId = playlist.UserId;
            existingPlaylist.SongIds = playlist.SongIds;
            existingPlaylist.IsPublic = playlist.IsPublic;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePlaylist(int id)
        {
            var playlist = _context.Playlists.Find(id);
            if (playlist == null) return NotFound();

            _context.Playlists.Remove(playlist);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
