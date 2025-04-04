interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPagesSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPagesSizeChange,
}: PaginationProps) => {
  return (
    <div className="flex item-center justify-center mt-4">
      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          disabled={currentPage === 1} // Disable previous button if on the first page
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn btn-outline-primary mx-1 ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => onPageChange(index + 1)}
            disabled={currentPage === index + 1} // Disable the current active page button
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-primary ms-2"
          disabled={currentPage === totalPages} // Disable next button if on the last page
          onClick={() => onPageChange(currentPage + 1)}
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
            onPagesSizeChange(Number(p.target.value));
            onPageChange(1); // Reset to first page when changing results per page
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
