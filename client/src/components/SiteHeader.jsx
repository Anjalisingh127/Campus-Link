import { env } from '../config/env.js';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={`${env.appName} home`}>
        <span className="brand-mark" aria-hidden="true">C</span>
        <span>{env.appName}</span>
      </a>
      <a className="header-link" href="#events">Explore events</a>
    </header>
  );
}
