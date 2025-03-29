import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // State for storing books retrieved from the API
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books available
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortEnabled, setSortEnabled] = useState<boolean>(false); // Sorting toggle state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order state
  const navigate = useNavigate();

  // Reset to the first page when category selection changes
  useEffect(() => {
    setPageNum(1);
  }, [selectedCategories]);

  // Fetch books from API whenever pagination, sorting, or category filters change
  useEffect(() => {
    const fetchBooks = async () => {
      // Construct category filter query parameters
      const categoryParams = selectedCategories
        .map((category) => `bookTypes=${encodeURIComponent(category)}`)
        .join('&');

      // Construct API URL with pagination and sorting options
      let url = `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`;

      if (sortEnabled) {
        url += `&sortBy=title&sortOrder=${sortOrder}`;
      }

      // Fetch books from API
      const response = await fetch(url);
      const data = await response.json();

      // Update state with retrieved book data
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortEnabled, sortOrder, selectedCategories]);

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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          disabled={pageNum === 1} // Disable previous button if on the first page
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn btn-outline-primary mx-1 ${pageNum === index + 1 ? 'active' : ''}`}
            onClick={() => setPageNum(index + 1)}
            disabled={pageNum === index + 1} // Disable the current active page button
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary ms-2"
          disabled={pageNum === totalPages} // Disable next button if on the last page
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      {/* Results per Page Selector */}
      <div className="mt-4 text-center">
        <label className="form-label me-2">Results per page:</label>
        <select
          className="form-select w-auto d-inline"
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1); // Reset to first page when changing results per page
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
