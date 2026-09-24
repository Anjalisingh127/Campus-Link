import { useEffect, useState } from 'react';
import { getCurrentUser } from './api/authApi.js';
import { SiteHeader } from './components/SiteHeader.jsx';
import { CreateEventPage } from './pages/CreateEventPage.jsx';
import { EventDetailsPage } from './pages/EventDetailsPage.jsx';
import { EventsPage } from './pages/EventsPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { ConfigurationPage } from './pages/ConfigurationPage.jsx';
import { AuditPage } from './pages/AuditPage.jsx';
import { EditEventPage } from './pages/EditEventPage.jsx';

const TOKEN_KEY = 'campus-connect-token';

function readRoute() {
  const hash = window.location.hash || '#/events';
  const path = hash.slice(1).split('?')[0];
  if (path === '/events/new') return { name: 'create' };
  if (path === '/login') return { name: 'login' };
  if (path === '/register') return { name: 'register' };
  if (path === '/admin/config') return { name: 'configuration' };
  if (path === '/admin/audit') return { name: 'audit' };
  const editMatch = path.match(/^\/events\/([a-f\d]{24})\/edit$/i);
  if (editMatch) return { name: 'edit', eventId: editMatch[1] };
  const match = path.match(/^\/events\/([a-f\d]{24})$/i);
  if (match) return { name: 'details', eventId: match[1] };
  return { name: 'events' };
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [auth, setAuth] = useState({ loading: true, token: sessionStorage.getItem(TOKEN_KEY), user: null });

  useEffect(() => {
    if (!window.location.hash) window.location.replace('#/events');
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!auth.token) {
      setAuth({ loading: false, token: null, user: null });
      return undefined;
    }
    const controller = new AbortController();
    getCurrentUser(auth.token, { signal: controller.signal })
      .then((response) => setAuth((current) => ({ ...current, loading: false, user: response.data })))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          sessionStorage.removeItem(TOKEN_KEY);
          setAuth({ loading: false, token: null, user: null });
        }
      });
    return () => controller.abort();
  }, [auth.token]);

  function handleAuthenticated(data) {
    sessionStorage.setItem(TOKEN_KEY, data.token);
    setAuth({ loading: false, token: data.token, user: data.user });
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuth({ loading: false, token: null, user: null });
    window.location.hash = '#/events';
  }

  return (
    <div id="top" className="app-shell">
      <SiteHeader user={auth.user} onLogout={handleLogout} />
      <main>
        {route.name === 'events' && <EventsPage />}
        {route.name === 'create' && auth.loading && <div className="detail-skeleton" aria-label="Restoring session" />}
        {route.name === 'create' && !auth.loading && auth.user?.role === 'admin' && <CreateEventPage token={auth.token} />}
        {route.name === 'create' && !auth.loading && auth.user?.role !== 'admin' && <AccessRequired user={auth.user} />}
        {route.name === 'details' && <EventDetailsPage eventId={route.eventId} token={auth.token} user={auth.user} />}
        {route.name === 'edit' && auth.loading && <div className="detail-skeleton" aria-label="Restoring session" />}
        {route.name === 'edit' && !auth.loading && auth.user?.role === 'admin' && <EditEventPage eventId={route.eventId} token={auth.token} />}
        {route.name === 'edit' && !auth.loading && auth.user?.role !== 'admin' && <AccessRequired user={auth.user} />}
        {route.name === 'login' && <AuthPage mode="login" onAuthenticated={handleAuthenticated} />}
        {route.name === 'register' && <AuthPage mode="register" onAuthenticated={handleAuthenticated} />}
        {route.name === 'configuration' && auth.loading && <div className="detail-skeleton" aria-label="Restoring session" />}
        {route.name === 'configuration' && !auth.loading && auth.user?.role === 'admin' && <ConfigurationPage token={auth.token} />}
        {route.name === 'configuration' && !auth.loading && auth.user?.role !== 'admin' && <AccessRequired user={auth.user} />}
        {route.name === 'audit' && auth.loading && <div className="detail-skeleton" aria-label="Restoring session" />}
        {route.name === 'audit' && !auth.loading && auth.user?.role === 'admin' && <AuditPage token={auth.token} />}
        {route.name === 'audit' && !auth.loading && auth.user?.role !== 'admin' && <AccessRequired user={auth.user} />}
      </main>
      <footer className="site-footer">
        <p>CampusConnect</p>
        <span>Built to make campus opportunities easier to discover.</span>
      </footer>
    </div>
  );
}

function AccessRequired({ user }) {
  return (
    <section className="page-panel access-panel">
      <p className="section-kicker">Restricted workflow</p>
      <h1>{user ? 'Administrator access required' : 'Sign in to continue'}</h1>
      <p>{user ? 'Your attendee account can discover events, but only administrators can create or manage them.' : 'Event management actions require an authenticated administrator account.'}</p>
      {!user && <a className="primary-link" href="#/login">Sign in</a>}
      {user && <a className="secondary-link" href="#/events">Return to events</a>}
    </section>
  );
}

export default App;
