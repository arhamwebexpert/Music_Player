using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_Player.Models;

namespace Music_Player.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly MusicPlayerDbContext _context;

        public AlbumController(MusicPlayerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllAlbums()
        {
            var albums = _context.Albums.ToList();
            return Ok(albums);
        }

        [HttpGet("{id}")]
        public IActionResult GetAlbumById(int id)
        {
            var album = _context.Albums.Find(id);
            if (album == null) return NotFound();
            return Ok(album);
        }

        [HttpPost]
        public IActionResult CreateAlbum([FromBody] Album album)
        {
            _context.Albums.Add(album);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAlbumById), new { id = album.Id }, album);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAlbum(int id, [FromBody] Album album)
        {
            var existingAlbum = _context.Albums.Find(id);
            if (existingAlbum == null) return NotFound();

            existingAlbum.Name = album.Name;
            existingAlbum.Artist = album.Artist;
            existingAlbum.CoverImageUrl = album.CoverImageUrl;
            existingAlbum.ReleaseDate = album.ReleaseDate;
            existingAlbum.SongIds = album.SongIds;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAlbum(int id)
        {
            var album = _context.Albums.Find(id);
            if (album == null) return NotFound();

            _context.Albums.Remove(album);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
