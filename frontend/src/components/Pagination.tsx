interface Props {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: Props) => (
  <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="itemsPerPage" className="form-label mb-0 small">
        Rows per page
      </label>
      <select
        id="itemsPerPage"
        className="form-select form-select-sm w-auto"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
      >
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
    </div>

    <span className="small">
      Page {currentPage} of {totalPages}
    </span>

    <div className="btn-group btn-group-sm">
      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="First page"
      >
        «
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        ‹
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        ›
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        »
      </button>
    </div>
  </div>
);

export default Pagination;
