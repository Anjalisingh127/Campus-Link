export function FeedbackPanel({ type, title, message, onRetry }) {
  return (
    <section className={`feedback feedback-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="feedback-mark" aria-hidden="true">{type === 'error' ? '!' : '·'}</span><h3>{title}</h3><p>{message}</p>
      {onRetry && <button type="button" onClick={onRetry}>Try again</button>}
    </section>
  );
}
