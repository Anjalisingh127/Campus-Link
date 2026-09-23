const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function formatEventDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date to be confirmed' : dateFormatter.format(date);
}

export function EventCard({ event }) {
  return (
    <article className="event-card">
      <div className="event-card-topline"><span className={`category category-${event.category}`}>{event.category}</span><span className={`event-status status-${event.status}`}>{event.status}</span></div>
      <div className="event-card-content">
        <p className="event-date">{formatEventDate(event.eventDate)}</p><h3><a className="card-title-link" href={`#/events/${event.id}`}>{event.title}</a></h3><p className="event-description">{event.description}</p>
        <dl className="event-facts"><div><dt>Organizer</dt><dd>{event.organizer}</dd></div><div><dt>Venue</dt><dd>{event.venue}</dd></div></dl>
        {event.tags?.length > 0 && <ul className="tag-list" aria-label="Event tags">{event.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
      </div>
      <div className="event-card-footer"><a href={`#/events/${event.id}`}>View details</a></div>
    </article>
  );
}
