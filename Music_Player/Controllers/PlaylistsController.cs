using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [HttpGet("user/{userId}")]
        public IActionResult GetUserPlaylists(int userId, [FromHeader(Name = "Session-Token")] string sessionToken)
        {
            var user = _context.Users.SingleOrDefault(u => u.Id == userId && u.SessionToken == sessionToken);
            if (user == null)
            {
                return Unauthorized("Invalid session.");
            }

            var playlists = _context.Playlists.Where(p => p.UserId == userId).ToList();
            return Ok(playlists);
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

        [HttpGet("{playlistId}/songs")]
        public IActionResult GetSongsInPlaylist(int playlistId)
        {
            // Get the playlist by ID
            var playlist = _context.Playlists
                .FirstOrDefault(p => p.Id == playlistId);

            if (playlist == null)
            {
                return NotFound("Playlist not found.");
            }

            // Fetch all songs based on the SongIds in the playlist
            var songsInPlaylist = _context.Songs
                .Where(s => playlist.SongIds.Contains(s.Id))
                .ToList();

            if (!songsInPlaylist.Any())
            {
                return NotFound("No songs found in this playlist.");
            }

            return Ok(songsInPlaylist);
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
        [HttpPost("{playlistId}/add-song")]
        public IActionResult AddSongToPlaylist([FromRoute] int playlistId, [FromBody] SongInPlaylistRequest request)
        {
            // Ensure the user is logged in by session token
            var user = _context.Users.SingleOrDefault(u => u.SessionToken == request.SessionToken);
            if (user == null)
            {
                return Unauthorized("Invalid session.");
            }

            // Fetch the playlist without using Include for SongIds
            var playlist = _context.Playlists.FirstOrDefault(p => p.Id == playlistId);
            if (playlist == null)
            {
                return NotFound("Playlist not found.");
            }

            // Ensure the song exists in the system
            var song = _context.Songs.FirstOrDefault(s => s.Id == request.SongId);
            if (song == null)
            {
                return NotFound("Song not found.");
            }

            // Log the playlist and song details for debugging
            Console.WriteLine($"Playlist ID: {playlistId}, Song ID: {request.SongId}");

            // Add song to playlist if not already added
            if (!playlist.SongIds.Contains(request.SongId))
            {
                playlist.SongIds.Add(request.SongId);
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    // Log the exception if SaveChanges fails
                    Console.WriteLine($"Error saving changes: {ex.Message}");
                    return StatusCode(500, "An error occurred while saving the song to the playlist.");
                }
            }
            else
            {
                return BadRequest("Song already exists in the playlist.");
            }

            return Ok("Song added to playlist.");
        }


    }
    public class SongInPlaylistRequest
{
    public int SongId { get; set; }
    public string SessionToken { get; set; }
}

}
