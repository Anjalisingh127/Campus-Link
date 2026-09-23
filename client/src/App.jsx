import { useEffect, useState } from 'react';
import { SiteHeader } from './components/SiteHeader.jsx';
import { CreateEventPage } from './pages/CreateEventPage.jsx';
import { EventDetailsPage } from './pages/EventDetailsPage.jsx';
import { EventsPage } from './pages/EventsPage.jsx';

function readRoute() {
  const hash = window.location.hash || '#/events';
  const path = hash.slice(1).split('?')[0];
  if (path === '/events/new') return { name: 'create' };
  const match = path.match(/^\/events\/([a-f\d]{24})$/i);
  if (match) return { name: 'details', eventId: match[1] };
  return { name: 'events' };
}

function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    if (!window.location.hash) window.location.replace('#/events');
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div id="top" className="app-shell">
      <SiteHeader />
      <main>
        {route.name === 'events' && <EventsPage />}
        {route.name === 'create' && <CreateEventPage />}
        {route.name === 'details' && <EventDetailsPage eventId={route.eventId} />}
      </main>
      <footer className="site-footer">
        <p>CampusConnect</p>
        <span>Built to make campus opportunities easier to discover.</span>
      </footer>
    </div>
  );
}

export default App;
