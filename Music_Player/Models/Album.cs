namespace Music_Player.Models
{
    public class Album
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string CoverImageUrl { get; set; } // Album artwork
        public List<int> SongIds { get; set; } = new();
        public DateTime ReleaseDate { get; set; }
    }

}
