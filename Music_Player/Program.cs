using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<MusicPlayerDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Configure form options (for file uploads)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50 MB
});

// Add CORS policy to allow React frontend to connect
builder.Services.AddCors(options =>
{
    // Define a CORS policy to allow requests from localhost:3000 (React app)
    options.AddPolicy("AllowReactApp",
        policy =>
            policy.WithOrigins("http://localhost:3000") // React dev server URL
                  .AllowAnyHeader()
                  .AllowAnyMethod());
});

// Add controllers (API controllers)
builder.Services.AddControllers();

var app = builder.Build();

// Apply CORS globally using the defined policy
app.UseCors("AllowReactApp"); // Correct CORS policy for React frontend

// Serve React files in production
if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles(); // Serve index.html for React
    app.UseStaticFiles();  // Serve React static files (build output)
}

// Enable HTTPS redirection (if you want to force HTTPS in production)
app.UseHttpsRedirection();

// Authorization middleware
app.UseAuthorization();

// Serve static files with a specific content type for audio (e.g., MP3)
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true, // Allow unknown file types
    DefaultContentType = "audio/mpeg" // Default to MP3 content type
});

// Map API controllers
app.MapControllers();

// Add fallback for React's client-side routing (SPA handling)
app.MapFallbackToFile("index.html");

app.Run();
