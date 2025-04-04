import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

// Functional component that displays a list of books with filtering, sorting, and pagination
function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // Local state for books, pagination, sorting, loading, and error handling
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // How many books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortEnabled, setSortEnabled] = useState<boolean>(false); // Sorting toggle
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sort direction
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [error, setError] = useState<string | null>(null); // Error message if fetch fails
  const [loading, setLoading] = useState(true); // Loading state while fetching data

  // When the selected categories change, reset to page 1
  useEffect(() => {
    setPageNum(1);
  }, [selectedCategories]);

  // Fetch books from API whenever page size, number, sorting, or filters change
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          selectedCategories,
          sortEnabled,
          sortOrder
        );

        // Update state with fetched data
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message); // Capture and store any error message
      } finally {
        setLoading(false); // Hide loading state after fetch
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortEnabled, sortOrder, selectedCategories]);

  // Show loading spinner/text while fetching books
  if (loading) {
    return <p>Loading books...</p>;
  }

  // Show an error message if fetch failed
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      {/* Sorting Toggle */}
      <div className="form-check form-switch d-flex align-items-center">
        <input
          className="form-check-input"
          type="checkbox"
          id="sortToggle"
          checked={sortEnabled}
          onChange={() => {
            setSortEnabled(!sortEnabled);
            setPageNum(1); // Reset to first page on toggle
          }}
          style={{ marginRight: '5px' }}
        />
        <label className="form-check-label" htmlFor="sortToggle">
          Enable Sorting
        </label>
      </div>

      {/* Sort Order Dropdown (visible only if sorting is enabled) */}
      {sortEnabled && (
        <div className="mt-2">
          <label className="form-label">Sort Order:</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setPageNum(1); // Reset to first page on sort change
            }}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      )}

      {/* Book Cards */}
      <div className="d-flex flex-column mt-4" style={{ width: '500px' }}>
        {books.map((book) => (
          <div className="card shadow-sm mb-4" key={book.bookID}>
            <div className="card-body">
              <h5 className="card-title">{book.title}</h5>
              <ul className="list-unstyled">
                <li>
                  <strong>Author:</strong> {book.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {book.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {book.isbn}
                </li>
                <li>
                  <strong>Classification:</strong> {book.classification}
                </li>
                <li>
                  <strong>Category:</strong> {book.category}
                </li>
                <li>
                  <strong>Number of Pages:</strong> {book.pageCount}
                </li>
                <li>
                  <strong>Price:</strong> ${book.price.toFixed(2)}
                </li>
              </ul>
              {/* Button to navigate to purchase page */}
              <button
                className="btn btn-success me-2"
                onClick={() => navigate(`/buy/${book.title}/${book.bookID}`)}
              >
                Buy Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPagesSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1); // Reset to first page on page size change
        }}
      />
    </div>
  );
}

export default BookList;
