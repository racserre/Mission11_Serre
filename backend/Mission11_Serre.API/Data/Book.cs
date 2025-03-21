using System.ComponentModel.DataAnnotations;

namespace Mission11_Serre.API.Data
{
    public class Book
    {
        // Primary key for the book entity
        [Key]
        [Required]
        public int BookID { get; set; }

        // Title of the book (required)
        [Required]
        public string Title { get; set; }

        // Author of the book (required)
        [Required]
        public string Author { get; set; }

        // Publisher of the book (required)
        [Required]
        public string Publisher { get; set; }

        // ISBN number of the book (required)
        [Required]
        public string ISBN { get; set; }

        // Classification of the book (required)
        [Required]
        public string Classification { get; set; }

        // Category of the book (required)
        [Required]
        public string Category { get; set; }

        // Number of pages in the book (required)
        [Required]
        public int PageCount { get; set; }

        // Price of the book (required)
        [Required]
        public double Price { get; set; }
    }
}
