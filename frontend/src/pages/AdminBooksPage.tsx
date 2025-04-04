import { useEffect, useState } from 'react';
// Import the Book type and necessary API and component functions
import { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooksPage = () => {
  // State to store all books
  const [books, setBooks] = useState<Book[]>([]);
  // State to store any fetch error
  const [error, setError] = useState<string | null>(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State for pagination: books per page
  const [pageSize, setPageSize] = useState<number>(5);
  // State for current page number
  const [pageNum, setPageNum] = useState<number>(1);
  // State for total number of pages (used by Pagination)
  const [totalPages, setTotalPages] = useState<number>(0);
  // State to toggle showing the "New Book" form
  const [showForm, setShowForm] = useState<boolean>(false);
  // State to store the book currently being edited
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Fetch book data on mount or when pageSize/pageNum changes
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(pageSize, pageNum, [], false, 'asc');
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [pageSize, pageNum]);

  // Function to handle deleting a book
  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookId);
      // Remove the deleted book from local state
      setBooks(books.filter((book) => book.bookID !== bookId));
    } catch (error) {
      alert('Failed to delete book. Please try again.');
    }
  };

  // If data is still loading, show a loading message
  if (loading) return <p>Loading books...</p>;
  // If there was an error, show it
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Books</h1>

      {/* Button to show the form for adding a new book */}
      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {/* Conditionally render the new book form */}
      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            // Refresh the book list after a successful add
            fetchBooks(pageSize, pageNum, [], false, 'asc').then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Conditionally render the edit book form */}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            // Refresh the book list after a successful edit
            fetchBooks(pageSize, pageNum, [], false, 'asc').then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {/* Table of all current books */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Number of Pages</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookID}>
              <td>{book.bookID}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price}</td>
              <td>
                {/* Button to start editing this book */}
                <button
                  onClick={() => setEditingBook(book)}
                  className="btn btn-primary btn-sm w-100 mb-1"
                >
                  Edit
                </button>
                {/* Button to delete this book */}
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(book.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component to navigate pages and change page size */}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPagesSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1); // Reset to first page when page size changes
        }}
      />
    </div>
  );
};

export default AdminBooksPage;
