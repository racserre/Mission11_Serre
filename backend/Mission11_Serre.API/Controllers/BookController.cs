using Microsoft.AspNetCore.Mvc;
using Mission11_Serre.API.Data;
using System.Linq;

namespace Mission11_Serre.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortBy = null, string sortOrder = "asc")
        {
            // Ensure books are loaded from the database
            IQueryable<Book> booksQuery = _bookContext.Books;

            // Apply sorting if sortBy is provided and valid
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "title":
                        booksQuery = sortOrder.ToLower() == "desc"
                            ? booksQuery.OrderByDescending(b => b.Title)
                            : booksQuery.OrderBy(b => b.Title);
                        break;

                    default:
                        // Return a BadRequest if an invalid sortBy value is given
                        return BadRequest("Invalid sorting field. Only 'title' is supported.");
                }
            }

            // Get total count before pagination for accurate metadata
            var totalNumBooks = booksQuery.Count();

            // Apply pagination
            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return formatted response
            return Ok(new
            {
                TotalNumBooks = totalNumBooks,
                Books = books
            });
        }
    }
}
