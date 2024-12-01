using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_Player.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SongsController : ControllerBase
{
    private readonly MusicPlayerDbContext _context;

    public SongsController(MusicPlayerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSongs(int page = 1, int pageSize = 10)
    {
        var songs = await _context.Songs
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return Ok(songs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSongById(int id)
    {
        var song = await _context.Songs.FindAsync(id);
        if (song == null) return NotFound();
        return Ok(song);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSong()
    {
        if (!Request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Invalid Content-Type. Expected 'multipart/form-data'.");
        }

        var form = await Request.ReadFormAsync();

        var name = form["name"].ToString();
        var singer = form["singer"].ToString();
        var genre = form["genre"].ToString();
        var duration = TimeSpan.Parse(form["duration"].ToString());

        var songFile = form.Files.FirstOrDefault();
        string fileUrl = null;

        if (songFile != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/songs");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid() + Path.GetExtension(songFile.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await songFile.CopyToAsync(stream);
            }

            fileUrl = $"/songs/{uniqueFileName}";
        }

        var song = new Song
        {
            Name = name,
            Singer = singer,
            Genre = genre,
            Duration = duration,
            FileUrl = fileUrl,
            PlayCount = 0
        };

        _context.Songs.Add(song);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSongById), new { id = song.Id }, song);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSong(int id, [FromBody] Song song)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingSong = await _context.Songs.FindAsync(id);
        if (existingSong == null) return NotFound();

        existingSong.Name = song.Name;
        existingSong.Singer = song.Singer;
        existingSong.Genre = song.Genre;
        existingSong.FileUrl = song.FileUrl;
        existingSong.Duration = song.Duration;
        existingSong.PlayCount = song.PlayCount;

        await _context.SaveChangesAsync();
        return Ok(existingSong);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSong(int id)
    {
        var song = await _context.Songs.FindAsync(id);
        if (song == null) return NotFound();

        _context.Songs.Remove(song);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
