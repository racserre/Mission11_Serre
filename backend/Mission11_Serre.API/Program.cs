using Microsoft.EntityFrameworkCore;
using Mission11_Serre.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Adds controller services
builder.Services.AddEndpointsApiExplorer(); // Adds endpoint exploration for Swagger
builder.Services.AddSwaggerGen(); // Adds Swagger generation

// Configure the DbContext to use SQLite with the connection string from the configuration
builder.Services.AddDbContext<BookDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection"));
});

builder.Services.AddCors(options => 
    options.AddPolicy("AllowReactApp",
    policy =>
    {
        policy.WithOrigins("https://yellow-tree-0d4d6231e.6.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod();
    }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enables Swagger UI in development
    app.UseSwaggerUI(); // Setup Swagger UI
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection(); // Redirect HTTP to HTTPS

app.UseAuthorization(); // Enables authorization middleware

app.MapControllers(); // Maps controllers to endpoints

app.Run(); // Runs the application
