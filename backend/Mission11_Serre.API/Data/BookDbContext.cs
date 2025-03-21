using Microsoft.EntityFrameworkCore;

namespace Mission11_Serre.API.Data
{
    // DbContext class for interacting with the Book database
    public class BookDbContext : DbContext
    {
        // Constructor that accepts DbContextOptions and passes it to the base class
        // This is used to configure the context for dependency injection
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        // DbSet for the 'Book' entity, represents the 'Books' table in the database
        public DbSet<Book> Books { get; set; }
    }
}
