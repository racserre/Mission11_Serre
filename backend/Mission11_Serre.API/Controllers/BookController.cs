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

        // Constructor to inject the database context
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        /// <summary>
        /// Retrieves a paginated list of books with optional sorting and filtering by category.
        /// </summary>
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(
            int pageSize = 5,
            int pageNum = 1,
            string? sortBy = null,
            string sortOrder = "asc",
            [FromQuery] List<string>? bookTypes = null)
        {
            IQueryable<Book> booksQuery = _bookContext.Books.AsQueryable();

            //  Filter by category if categories were provided
            if (bookTypes != null && bookTypes.Any())
            {
                booksQuery = booksQuery.Where(b => bookTypes.Contains(b.Category));
            }

            //  Handle sorting (currently only supports 'title')
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
                        //  If someone passes an invalid field (e.g., 'price'), it will error
                        return BadRequest("Invalid sorting field. Only 'title' is supported.");
                }
            }

            //  Get total count before pagination
            var totalNumBooks = booksQuery.Count();

            //  Apply pagination
            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                TotalNumBooks = totalNumBooks,
                Books = books
            });
        }

        /// <summary>
        /// Retrieves a distinct list of book categories.
        /// </summary>
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
        /// Gets the price of a specific book by ID.
        /// </summary>
        [HttpGet("GetBookPrice/{bookId}")]
        public IActionResult GetBookPrice(int bookId)
        {
            var book = _bookContext.Books.FirstOrDefault(b => b.BookID == bookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            return Ok(new { bookId = book.BookID, price = book.Price });
        }

        /// <summary>
        /// Adds a new book to the database.
        /// </summary>
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();

            return Ok(newBook); 
        }

        /// <summary>
        /// Updates an existing book by ID.
        /// </summary>
        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            
            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }

            //  Update all fields
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

        /// <summary>
        /// Deletes a book by ID.
        /// </summary>
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
