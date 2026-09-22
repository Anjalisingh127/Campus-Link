import { useEffect, useState } from 'react';
import { getEvents } from './api/eventsApi.js';
import { EventFilters } from './components/EventFilters.jsx';
import { EventGrid } from './components/EventGrid.jsx';
import { FeedbackPanel } from './components/FeedbackPanel.jsx';
import { Pagination } from './components/Pagination.jsx';
import { SiteHeader } from './components/SiteHeader.jsx';

const initialQuery = {
  search: '', category: '', status: 'published', sort: 'eventDate', order: 'asc', page: 1, limit: 6,
};

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [searchDraft, setSearchDraft] = useState('');
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0, pages: 0 });
  const [requestState, setRequestState] = useState({ loading: true, error: '' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadEvents() {
      setRequestState({ loading: true, error: '' });
      try {
        const response = await getEvents(query, { signal: controller.signal });
        setEvents(response.data);
        setMeta(response.meta);
        setRequestState({ loading: false, error: '' });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setEvents([]);
          setRequestState({ loading: false, error: error.message });
        }
      }
    }
    loadEvents();
    return () => controller.abort();
  }, [query, retryCount]);

  function updateQuery(field, value) {
    setQuery((current) => ({ ...current, [field]: value, page: 1 }));
  }

  function submitSearch(event) {
    event.preventDefault();
    updateQuery('search', searchDraft.trim());
  }

  function resetFilters() {
    setSearchDraft('');
    setQuery(initialQuery);
  }

  return (
    <div id="top" className="app-shell">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Built for campus life</p>
            <h1>Find the events that move you forward.</h1>
            <p className="hero-summary">Workshops, seminars, technical sessions, and cultural moments—organized in one focused place.</p>
            <a className="primary-link" href="#events">Browse opportunities</a>
          </div>
          <aside className="hero-stat" aria-label="Available event count">
            <span>{requestState.loading ? '—' : meta.total}</span>
            <p>events matching your current view</p>
          </aside>
        </section>
        <div id="events" className="content-layout">
          <EventFilters query={query} searchDraft={searchDraft} onSearchDraftChange={setSearchDraft} onSearch={submitSearch} onChange={updateQuery} onReset={resetFilters} />
          <section className="results" aria-live="polite" aria-busy={requestState.loading}>
            <div className="results-heading"><p>{meta.total} {meta.total === 1 ? 'event' : 'events'} found</p>{query.search && <span>Results for “{query.search}”</span>}</div>
            {requestState.loading && <div className="skeleton-grid" aria-label="Loading events">{Array.from({ length: 3 }, (_, index) => <div className="skeleton-card" key={index} />)}</div>}
            {!requestState.loading && requestState.error && <FeedbackPanel type="error" title="We couldn’t load the events" message={requestState.error} onRetry={() => setRetryCount((count) => count + 1)} />}
            {!requestState.loading && !requestState.error && events.length === 0 && <FeedbackPanel type="empty" title="No events match this view" message="Try a different keyword or reset the filters to explore everything available." />}
            {!requestState.loading && !requestState.error && events.length > 0 && (
              <><EventGrid events={events} /><Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => setQuery((current) => ({ ...current, page }))} /></>
            )}
          </section>
        </div>
      </main>
      <footer className="site-footer"><p>CampusConnect</p><span>Built to make campus opportunities easier to discover.</span></footer>
    </div>
  );
}

export default App;
