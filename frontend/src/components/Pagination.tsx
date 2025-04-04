// Props interface for the Pagination component
interface PaginationProps {
  currentPage: number; // The current active page number
  totalPages: number; // Total number of pages available
  pageSize: number; // How many items are displayed per page
  onPageChange: (page: number) => void; // Function to handle page number change
  onPagesSizeChange: (newSize: number) => void; // Function to handle change in items per page
}

// Functional component for rendering pagination controls
const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPagesSizeChange,
}: PaginationProps) => {
  return (
    <div className="flex item-center justify-center mt-4">
      {/* Page navigation buttons */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          disabled={currentPage === 1} // Disable "Previous" if already on the first page
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Dynamically generate numbered page buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn btn-outline-primary mx-1 ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => onPageChange(index + 1)}
            disabled={currentPage === index + 1} // Disable the current page button
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary ms-2"
          disabled={currentPage === totalPages} // Disable "Next" if already on the last page
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Dropdown to select how many results to show per page */}
      <div className="mt-4 text-center">
        <label className="form-label me-2">Results per page:</label>
        <select
          className="form-select w-auto d-inline"
          value={pageSize}
          onChange={(p) => {
            onPagesSizeChange(Number(p.target.value)); // Update items per page
            onPageChange(1); // Reset to page 1 after size change
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
