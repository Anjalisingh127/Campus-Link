const categories = [
  ['', 'All categories'], ['technical', 'Technical'], ['cultural', 'Cultural'], ['sports', 'Sports'],
  ['workshop', 'Workshop'], ['seminar', 'Seminar'], ['other', 'Other'],
];

export function EventFilters({ query, searchDraft, onSearchDraftChange, onSearch, onChange, onReset }) {
  return (
    <section className="filters" aria-labelledby="filters-title">
      <div className="filters-heading">
        <div><p className="section-kicker">Find your next opportunity</p><h2 id="filters-title">Explore campus events</h2></div>
        <button className="text-button" type="button" onClick={onReset}>Reset filters</button>
      </div>
      <form className="search-form" onSubmit={onSearch} role="search">
        <label className="sr-only" htmlFor="event-search">Search events</label>
        <input id="event-search" type="search" value={searchDraft} maxLength="100" placeholder="Search by title, organizer, keyword…" onChange={(event) => onSearchDraftChange(event.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div className="filter-grid">
        <label><span>Category</span><select value={query.category} onChange={(event) => onChange('category', event.target.value)}>{categories.map(([value, label]) => <option key={label} value={value}>{label}</option>)}</select></label>
        <label><span>Status</span><select value={query.status} onChange={(event) => onChange('status', event.target.value)}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></label>
        <label><span>Sort by</span><select value={query.sort} onChange={(event) => onChange('sort', event.target.value)}><option value="eventDate">Event date</option><option value="createdAt">Recently added</option><option value="title">Title</option></select></label>
        <label><span>Order</span><select value={query.order} onChange={(event) => onChange('order', event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
      </div>
    </section>
  );
}
