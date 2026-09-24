import { useEffect, useState } from 'react';
import { getEvent, updateEvent } from '../api/eventsApi.js';
import { EventForm } from '../components/EventForm.jsx';
import { FeedbackPanel } from '../components/FeedbackPanel.jsx';

function toFormValues(event) {
  const eventDate = new Date(event.eventDate);
  const localDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60_000);
  return {
    title: event.title,
    description: event.description,
    category: event.category,
    organizer: event.organizer,
    venue: event.venue,
    eventDate: localDate.toISOString().slice(0, 16),
    registrationUrl: event.registrationUrl ?? '',
    tags: event.tags?.join(', ') ?? '',
    status: event.status,
  };
}

export function EditEventPage({ eventId, token }) {
  const [state, setState] = useState({ loading: true, event: null, error: '' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, event: null, error: '' });
    getEvent(eventId, { signal: controller.signal })
      .then((response) => setState({ loading: false, event: response.data, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ loading: false, event: null, error: error.message });
      });
    return () => controller.abort();
  }, [eventId, retryCount]);

  async function submit(payload) {
    const response = await updateEvent(eventId, payload, token);
    window.location.hash = `#/events/${response.data.id}`;
  }

  if (state.loading) return <div className="detail-skeleton" aria-label="Loading event editor" />;
  if (state.error) return <div className="page-panel"><FeedbackPanel type="error" title="Event editor unavailable" message={state.error} onRetry={() => setRetryCount((count) => count + 1)} /></div>;

  return (
    <section className="page-panel form-page" aria-labelledby="edit-title">
      <div className="page-intro">
        <p className="section-kicker">Administrator workflow</p>
        <h1 id="edit-title">Edit campus event</h1>
        <p>Update the event record. Successful changes are captured in the operational audit trail.</p>
      </div>
      <EventForm initialValues={toFormValues(state.event)} onSubmit={submit} submitLabel="Save changes" workingLabel="Saving…" />
    </section>
  );
}
