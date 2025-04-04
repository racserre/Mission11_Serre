import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // State for storing books retrieved from the API
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortEnabled, setSortEnabled] = useState<boolean>(false); // Sorting toggle state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order state
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Reset to the first page when category selection changes
  useEffect(() => {
    setPageNum(1);
  }, [selectedCategories]);

  // Fetch books from API whenever pagination, sorting, or category filters change
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

        // Update state with retrieved book data
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortEnabled, sortOrder, selectedCategories]);

  if (loading) {
    return <p>Loading books...</p>;
  }
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
            setPageNum(1); // Reset to first page when sorting is toggled
          }}
          style={{ marginRight: '5px' }}
        />
        <label className="form-check-label" htmlFor="sortToggle">
          Enable Sorting
        </label>
      </div>

      {/* Sorting Order Dropdown */}
      {sortEnabled && (
        <div className="mt-2">
          <label className="form-label">Sort Order:</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setPageNum(1); // Reset to first page on sorting change
            }}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      )}

      {/* Book List */}
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
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPagesSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
}

export default BookList;
