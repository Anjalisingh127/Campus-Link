import { createEvent } from '../api/eventsApi.js';
import { EventForm } from '../components/EventForm.jsx';

const initialForm = {
  title: '', description: '', category: 'technical', organizer: '', venue: '', eventDate: '',
  registrationUrl: '', tags: '', status: 'published',
};

export function CreateEventPage({ token }) {
  async function submit(payload) {
    const response = await createEvent(payload, token);
    window.location.hash = `#/events/${response.data.id}`;
  }

  return (
    <section className="page-panel form-page" aria-labelledby="create-title">
      <div className="page-intro">
        <p className="section-kicker">Event management</p>
        <h1 id="create-title">Create a campus event</h1>
        <p>Publish accurate event information so students can discover and register without confusion.</p>
      </div>
      <EventForm initialValues={initialForm} onSubmit={submit} submitLabel="Create event" workingLabel="Creating…" />
    </section>
  );
}
