namespace Music_Player.Models
{
    public class Playlist
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; } // Owner of the playlist
        public List<int> SongIds { get; set; } = new(); // IDs of songs in the playlist
        public bool IsPublic { get; set; } // Visibility setting
    }

}
