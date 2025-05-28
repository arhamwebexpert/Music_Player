# Music Player Application

A modern web-based music player application built with ASP.NET Core 8.0 and React, providing a seamless music listening experience.

## Features

- 🎵 Music playback with standard controls (play, pause, skip, volume)
- 📱 Responsive design for both desktop and mobile devices
- 🔍 Search functionality to find your favorite tracks
- 📋 Playlist management
- 🎨 Modern and intuitive user interface
- 🔐 User authentication and authorization
- 💾 Persistent storage using MySQL database
- 🎯 RESTful API architecture

## Tech Stack

- **Backend:**
  - ASP.NET Core 8.0
  - Entity Framework Core
  - MySQL Database
  - Swagger/OpenAPI for API documentation

- **Frontend:**
  - React.js
  - Modern CSS frameworks
  - Responsive design

## Prerequisites

- .NET 8.0 SDK
- Node.js (LTS version)
- MySQL Server
- Visual Studio 2022 or Visual Studio Code
- Git

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd Music_Player
   ```

2. **Backend Setup**
   ```bash
   cd Music_Player
   dotnet restore
   dotnet build
   ```

3. **Database Setup**
   - Install MySQL Server if not already installed
   - Update the connection string in `appsettings.json` with your MySQL credentials
   - Run the following commands to set up the database:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Frontend Setup**
   ```bash
   cd client-side
   npm install
   npm start
   ```

5. **Run the Application**
   ```bash
   # In the backend directory
   dotnet run
   ```

The application will be available at:
- Backend API: `https://localhost:5001`
- Frontend: `http://localhost:3000`
- Swagger Documentation: `https://localhost:5001/swagger`

## Project Structure

```
Music_Player/
├── Controllers/         # API Controllers
├── Models/             # Data Models
├── Data/              # Database Context and Migrations
├── client-side/       # React Frontend
├── wwwroot/          # Static Files
└── Program.cs        # Application Entry Point
```

### Frontend Structure
```
client-side/
├── public/              # Static files
│   ├── index.html      # Main HTML file
│   └── assets/         # Static assets (images, fonts)
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── Player/     # Music player components
│   │   ├── Playlist/   # Playlist management
│   │   └── Auth/       # Authentication components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   ├── styles/        # CSS/SCSS files
│   ├── App.js         # Main App component
│   └── index.js       # Entry point
├── package.json       # Dependencies and scripts
└── README.md         # Frontend documentation
```

## API Documentation

The API documentation is available through Swagger UI when running the application. Visit `https://localhost:5001/swagger` to explore the available endpoints and test them.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
