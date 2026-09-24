import { useCallback, useEffect, useState } from 'react';
import { downloadAuditReport, getAuditLogs, getAuditSummary } from '../api/auditApi.js';
import { FeedbackPanel } from '../components/FeedbackPanel.jsx';

const initialFilters = { action: '', from: '', to: '', page: 1, limit: 10 };
const actionLabels = {
  'event.created': 'Created',
  'event.updated': 'Updated',
  'event.deleted': 'Deleted',
};
const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function AuditPage({ token }) {
  const [filters, setFilters] = useState(initialFilters);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [state, setState] = useState({ loading: true, error: '' });

  const loadData = useCallback(async (signal) => {
    setState({ loading: true, error: '' });
    try {
      const [logsResponse, summaryResponse] = await Promise.all([
        getAuditLogs(filters, token, { signal }),
        getAuditSummary(token, { signal }),
      ]);
      setLogs(logsResponse.data);
      setMeta(logsResponse.meta);
      setSummary(summaryResponse.data);
      setState({ loading: false, error: '' });
    } catch (error) {
      if (error.name !== 'AbortError') setState({ loading: false, error: error.message });
    }
  }, [filters, token]);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  async function downloadCsv() {
    try {
      await downloadAuditReport(token);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  }

  return (
    <section className="admin-page audit-page">
      <div className="admin-heading">
        <div><p className="section-kicker">Administrator operations</p><h1>Operational audit</h1><p>Review traceable event changes, monitor activity totals, and export evidence for reporting.</p></div>
        <button className="secondary-button" type="button" onClick={downloadCsv}>Download CSV</button>
      </div>

      {summary && (
        <div className="audit-summary" aria-label="Audit action summary">
          <SummaryCard label="Total actions" value={summary.total} />
          <SummaryCard label="Events created" value={summary.actions['event.created']} />
          <SummaryCard label="Events updated" value={summary.actions['event.updated']} />
          <SummaryCard label="Events deleted" value={summary.actions['event.deleted']} />
        </div>
      )}

      <div className="audit-toolbar">
        <label className="form-field"><span>Action</span><select name="action" value={filters.action} onChange={updateFilter}><option value="">All actions</option>{Object.entries(actionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="form-field"><span>From</span><input name="from" type="date" value={filters.from} max={filters.to || undefined} onChange={updateFilter} /></label>
        <label className="form-field"><span>To</span><input name="to" type="date" value={filters.to} min={filters.from || undefined} onChange={updateFilter} /></label>
        <button className="text-button audit-reset" type="button" onClick={() => setFilters(initialFilters)}>Reset filters</button>
      </div>

      {state.error && <div className="form-alert" role="alert">{state.error}</div>}
      {state.loading && <div className="audit-loading" aria-label="Loading audit history" />}
      {!state.loading && !state.error && logs.length === 0 && <FeedbackPanel type="empty" title="No audit records found" message="Try a different action or date range." />}
      {!state.loading && logs.length > 0 && (
        <div className="audit-list">
          {logs.map((log) => (
            <article className="audit-item" key={log.id}>
              <div className="audit-action-row"><span className={`audit-action ${log.action.replace('.', '-')}`}>{actionLabels[log.action] ?? log.action}</span><time dateTime={log.createdAt}>{dateFormatter.format(new Date(log.createdAt))}</time></div>
              <h2>{log.description}</h2>
              <p>{log.actorSnapshot?.name ?? 'Administrator'} · {log.actorSnapshot?.email ?? 'Email unavailable'}</p>
              <dl><div><dt>Resource</dt><dd>{log.resourceType}</dd></div><div><dt>Resource ID</dt><dd>{log.resourceId}</dd></div>{log.metadata?.changedFields?.length > 0 && <div><dt>Changed fields</dt><dd>{log.metadata.changedFields.join(', ')}</dd></div>}</dl>
            </article>
          ))}
        </div>
      )}

      {meta.pages > 1 && (
        <nav className="pagination" aria-label="Audit pagination">
          <button type="button" disabled={meta.page <= 1 || state.loading} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>Previous</button>
          <span>Page {meta.page} of {meta.pages}</span>
          <button type="button" disabled={meta.page >= meta.pages || state.loading} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Next</button>
        </nav>
      )}
    </section>
  );
}

function SummaryCard({ label, value }) {
  return <article className="summary-card"><span>{label}</span><strong>{value}</strong></article>;
}
