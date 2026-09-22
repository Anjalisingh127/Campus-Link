import { EventCard } from './EventCard.jsx';

export function EventGrid({ events }) {
  return <div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>;
}
