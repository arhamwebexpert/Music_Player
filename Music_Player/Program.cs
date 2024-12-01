using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<MusicPlayerDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));


builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50 MB
});


// Add CORS to allow React frontend to connect
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // URL of React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});


// Add controllers
builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("AllowAll");

// Use CORS
app.UseCors("AllowAll");

// Serve React files in production
if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles(); // Serve index.html
    app.UseStaticFiles();  // Serve React static files
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true, // Allow unknown file types
    DefaultContentType = "audio/mpeg" // Default to MP3
});

app.MapControllers();

// Add fallback for React's client-side routing
app.MapFallbackToFile("index.html");

app.Run();
