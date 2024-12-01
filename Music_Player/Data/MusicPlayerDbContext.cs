using Microsoft.EntityFrameworkCore;
using Music_Player.Models;

public class MusicPlayerDbContext : DbContext
{
    public DbSet<Song> Songs { get; set; }

    public MusicPlayerDbContext(DbContextOptions<MusicPlayerDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Song>().HasKey(s => s.Id);
        modelBuilder.Entity<Song>().Property(s => s.Name).IsRequired();
        modelBuilder.Entity<Song>().Property(s => s.Singer).IsRequired();
        modelBuilder.Entity<Song>().Property(s => s.Genre).IsRequired();
    }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<User> Users { get; set; }
}
