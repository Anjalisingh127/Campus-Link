export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Event results pages">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span>Page <strong>{page}</strong> of <strong>{pages}</strong></span>
      <button type="button" disabled={page === pages} onClick={() => onPageChange(page + 1)}>Next</button>
    </nav>
  );
}
