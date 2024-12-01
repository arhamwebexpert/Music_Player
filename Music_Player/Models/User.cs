namespace Music_Player.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; } // Store hashed passwords for security
        public string Email { get; set; }
        public string ProfilePictureUrl { get; set; }
        public List<Playlist> Playlists { get; set; } = new();
        public List<int> LikedSongs { get; set; } = new(); // List of song IDs
        public string SessionToken { get; set; }

    }


}
