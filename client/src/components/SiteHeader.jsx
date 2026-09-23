import { env } from '../config/env.js';

export function SiteHeader({ user, onLogout }) {
  return (
    <header className="site-header">
      <a className="brand" href="#/events" aria-label={`${env.appName} home`}>
        <span className="brand-mark" aria-hidden="true">C</span>
        <span>{env.appName}</span>
      </a>
      <nav className="header-nav" aria-label="Primary navigation">
        <a className="header-link" href="#/events">Explore events</a>
        {user?.role === 'admin' && <a className="header-action" href="#/events/new">Create event</a>}
        {user ? <><span className="header-user">{user.name}</span><button className="header-logout" type="button" onClick={onLogout}>Sign out</button></> : <a className="header-action" href="#/login">Sign in</a>}
      </nav>
    </header>
  );
}
