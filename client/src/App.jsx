import { env } from './config/env.js';

function App() {
  return (
    <main className="shell">
      <p className="eyebrow">{env.appName}</p>
      <h1>One place for every campus opportunity.</h1>
      <p className="summary">
        Discover events, workshops, hackathons, and student activities through a reliable full-stack platform.
      </p>
      <section className="status" aria-label="Development status">
        <span className="status-dot" aria-hidden="true" />
        Project foundation is ready
      </section>
    </main>
  );
}

export default App;
