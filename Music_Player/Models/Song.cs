namespace Music_Player.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Singer { get; set; }
        public string Genre { get; set; }
        public string FileUrl { get; set; } // Path to the audio file
        public TimeSpan Duration { get; set; }
        public int PlayCount { get; set; } // Track popularity
    }

}
