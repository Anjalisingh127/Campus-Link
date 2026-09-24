import { useEffect, useState } from 'react';
import { deleteEvent, getEvent } from '../api/eventsApi.js';
import { FeedbackPanel } from '../components/FeedbackPanel.jsx';

const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'full', timeStyle: 'short' });

export function EventDetailsPage({ eventId, token, user }) {
  const [state, setState] = useState({ loading: true, event: null, error: '' });
  const [actionState, setActionState] = useState({ working: false, error: '' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadEvent() {
      setState({ loading: true, event: null, error: '' });
      try {
        const response = await getEvent(eventId, { signal: controller.signal });
        setState({ loading: false, event: response.data, error: '' });
      } catch (error) {
        if (error.name !== 'AbortError') setState({ loading: false, event: null, error: error.message });
      }
    }
    loadEvent();
    return () => controller.abort();
  }, [eventId, retryCount]);

  if (state.loading) return <div className="detail-skeleton" aria-label="Loading event details" />;
  if (state.error) return <div className="page-panel"><FeedbackPanel type="error" title="We couldn’t load this event" message={state.error} onRetry={() => setRetryCount((count) => count + 1)} /></div>;

  const event = state.event;

  async function removeEvent() {
    const confirmed = window.confirm(`Delete "${event.title}"? This action cannot be undone.`);
    if (!confirmed) return;
    setActionState({ working: true, error: '' });
    try {
      await deleteEvent(eventId, token);
      window.location.hash = '#/events';
    } catch (error) {
      setActionState({ working: false, error: error.message });
    }
  }

  return (
    <article className="page-panel event-detail">
      <a className="back-link" href="#/events">← Back to events</a>
      <div className="detail-heading">
        <div><span className={`category category-${event.category}`}>{event.category}</span><h1>{event.title}</h1></div>
        <span className={`event-status status-${event.status}`}>{event.status}</span>
      </div>
      <p className="detail-date">{dateFormatter.format(new Date(event.eventDate))}</p>
      <p className="detail-description">{event.description}</p>
      <dl className="detail-facts">
        <div><dt>Organizer</dt><dd>{event.organizer}</dd></div>
        <div><dt>Venue</dt><dd>{event.venue}</dd></div>
      </dl>
      {event.tags?.length > 0 && <ul className="tag-list" aria-label="Event tags">{event.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
      <div className="detail-actions">
        {event.registrationUrl ? <a className="primary-link" href={event.registrationUrl} target="_blank" rel="noreferrer">Open registration</a> : <span>Registration details are not available yet.</span>}
        {user?.role === 'admin' && (
          <div className="admin-event-actions">
            <a className="secondary-link" href={`#/events/${event.id}/edit`}>Edit event</a>
            <button className="danger-button" type="button" disabled={actionState.working} onClick={removeEvent}>{actionState.working ? 'Deleting…' : 'Delete event'}</button>
          </div>
        )}
      </div>
      {actionState.error && <div className="form-alert detail-action-error" role="alert">{actionState.error}</div>}
    </article>
  );
}
