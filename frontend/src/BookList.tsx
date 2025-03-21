import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortEnabled, setSortEnabled] = useState<boolean>(false); // Toggle sorting on/off
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting direction

  useEffect(() => {
    const fetchBooks = async () => {
      let url = `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`;

      if (sortEnabled) {
        url += `&sortBy=title&sortOrder=${sortOrder}`; // Pass sorting criteria to the API
      }

      const response = await fetch(url); // Fetch data from API
      const data = await response.json(); // Parse the response
      setBooks(data.books); // Set fetched books in state
      setTotalItems(data.totalNumBooks); // ✅ Keeping this logic unchanged
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // ✅ Fix: Uses correct value
    };

    fetchBooks(); // Fetch books when dependencies change
  }, [pageSize, pageNum, sortEnabled, sortOrder]); // ✅ Removed totalItems from dependencies

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Book List</h1>

      {/* Sorting Toggle */}
      <div className="form-check form-switch d-flex align-items-center">
        <input
          className="form-check-input"
          type="checkbox"
          id="sortToggle"
          checked={sortEnabled}
          onChange={() => {
            setSortEnabled(!sortEnabled); // Toggle sorting enabled state
            setPageNum(1); // Reset to first page if sorting changes
          }}
          style={{ marginRight: '5px' }} // Adjust the right margin for closer proximity
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
              setSortOrder(e.target.value as 'asc' | 'desc'); // Change sorting order
              setPageNum(1); // Reset to first page when sorting changes
            }}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      )}

      {/* Book Cards */}
      <div className="mt-4">
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
                  <strong>Price:</strong> ${book.price}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)} // Decrement page number
        >
          Previous
        </button>

        {/* Dynamic Pagination Buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn btn-outline-primary mx-1 ${pageNum === index + 1 ? 'active' : ''}`}
            onClick={() => setPageNum(index + 1)} // Set the page number on click
            disabled={pageNum === index + 1} // Disable button if it's the current page
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary ms-2"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)} // Increment page number
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
            setPageSize(Number(p.target.value)); // Change the page size
            setPageNum(1); // Reset to first page on page size change
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
