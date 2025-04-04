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

        // Constructor to initialize the database context
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        /// <summary>
        /// Retrieves a paginated list of books with optional sorting and filtering by category.
        /// </summary>
        /// <param name="pageSize">Number of books per page (default: 5).</param>
        /// <param name="pageNum">Current page number (default: 1).</param>
        /// <param name="sortBy">Field to sort by (currently supports 'title').</param>
        /// <param name="sortOrder">Sorting order: 'asc' (default) or 'desc'.</param>
        /// <param name="bookTypes">Optional list of book categories to filter.</param>
        /// <returns>A JSON object containing the total number of books and the paginated list of books.</returns>
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortBy = null, string sortOrder = "asc", [FromQuery] List<string>? bookTypes = null)
        {
            // Retrieve books from the database
            IQueryable<Book> booksQuery = _bookContext.Books.AsQueryable();

            // Filter books based on the provided categories
            if (bookTypes != null && bookTypes.Any())
            {
                booksQuery = booksQuery.Where(b => bookTypes.Contains(b.Category));
            }

            // Apply sorting if a valid field is provided
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
                        // Return a BadRequest if an unsupported sorting field is requested
                        return BadRequest("Invalid sorting field. Only 'title' is supported.");
                }
            }

            // Get total number of books before pagination
            var totalNumBooks = booksQuery.Count();

            // Apply pagination to fetch only the required books
            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return the result as a JSON response
            return Ok(new
            {
                TotalNumBooks = totalNumBooks,
                Books = books
            });
        }

        /// <summary>
        /// Retrieves a distinct list of all book categories available in the database.
        /// </summary>
        /// <returns>A JSON array of unique book categories.</returns>
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookTypes = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }

        /// <summary>
        /// Retrieves the price of a book based on its ID.
        /// </summary>
        /// <param name="bookId">The ID of the book.</param>
        /// <returns>A JSON object containing the book ID and its price.</returns>
        [HttpGet("GetBookPrice/{bookId}")]
        public IActionResult GetBookPrice(int bookId)
        {
            // Fetch the book from the database
            var book = _bookContext.Books.FirstOrDefault(b => b.BookID == bookId);

            // Return 404 if the book is not found
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            // Return the book price
            return Ok(new { bookId = book.BookID, price = book.Price });
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);

        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);

        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new {message = "Project not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();

        }
    }
}
