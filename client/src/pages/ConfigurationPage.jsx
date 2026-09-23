import { useCallback, useEffect, useState } from 'react';
import {
  downloadConfigurationAudit,
  getConfiguration,
  getConfigurationHistory,
  restoreConfiguration,
  updateConfiguration,
} from '../api/configurationApi.js';
import { FeedbackPanel } from '../components/FeedbackPanel.jsx';

const emptySettings = {
  siteName: 'CampusConnect', eventSubmissionEnabled: true, registrationEnabled: true,
  defaultPageSize: 6, maintenanceMessage: '',
};

export function ConfigurationPage({ token }) {
  const [configuration, setConfiguration] = useState(null);
  const [settings, setSettings] = useState(emptySettings);
  const [history, setHistory] = useState([]);
  const [changeReason, setChangeReason] = useState('');
  const [restoreReason, setRestoreReason] = useState('');
  const [state, setState] = useState({ loading: true, working: false, error: '', success: '' });

  const loadData = useCallback(async (signal) => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [configurationResponse, historyResponse] = await Promise.all([
        getConfiguration(token, { signal }), getConfigurationHistory(token, { signal }),
      ]);
      setConfiguration(configurationResponse.data);
      setSettings(configurationResponse.data.settings);
      setHistory(historyResponse.data);
      setState((current) => ({ ...current, loading: false }));
    } catch (error) {
      if (error.name !== 'AbortError') setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  function updateSetting(event) {
    const { name, type, checked, value } = event.target;
    setSettings((current) => ({ ...current, [name]: type === 'checkbox' ? checked : name === 'defaultPageSize' ? Number(value) : value }));
  }

  async function saveConfiguration(event) {
    event.preventDefault();
    setState((current) => ({ ...current, working: true, error: '', success: '' }));
    try {
      const response = await updateConfiguration(settings, changeReason.trim(), token);
      setChangeReason('');
      setState((current) => ({ ...current, working: false, success: `Version ${response.data.version} published successfully.` }));
      await loadData();
    } catch (error) {
      setState((current) => ({ ...current, working: false, error: error.message }));
    }
  }

  async function restore(version) {
    setState((current) => ({ ...current, working: true, error: '', success: '' }));
    try {
      const response = await restoreConfiguration(version, restoreReason.trim(), token);
      setRestoreReason('');
      setState((current) => ({ ...current, working: false, success: `Version ${version} restored as version ${response.data.version}.` }));
      await loadData();
    } catch (error) {
      setState((current) => ({ ...current, working: false, error: error.message }));
    }
  }

  async function downloadAudit() {
    try {
      await downloadConfigurationAudit(token);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  }

  if (state.loading) return <div className="detail-skeleton" aria-label="Loading configuration" />;
  if (state.error && !configuration) return <div className="page-panel"><FeedbackPanel type="error" title="Configuration unavailable" message={state.error} onRetry={() => loadData()} /></div>;

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div><p className="section-kicker">Administrator operations</p><h1>Platform configuration</h1><p>Publish validated settings with traceable reasons and recoverable version history.</p></div>
        <div className="version-badge"><span>Active version</span><strong>{configuration.version}</strong></div>
      </div>
      {(state.error || state.success) && <div className={state.error ? 'form-alert' : 'success-alert'} role="status">{state.error || state.success}</div>}
      <div className="admin-grid">
        <form className="configuration-card" onSubmit={saveConfiguration}>
          <h2>Active settings</h2>
          <label className="form-field"><span>Site name</span><input name="siteName" value={settings.siteName} minLength="2" maxLength="80" required onChange={updateSetting} /></label>
          <label className="form-field"><span>Default page size</span><input name="defaultPageSize" type="number" value={settings.defaultPageSize} min="1" max="50" required onChange={updateSetting} /></label>
          <label className="toggle-field"><input name="eventSubmissionEnabled" type="checkbox" checked={settings.eventSubmissionEnabled} onChange={updateSetting} /><span>Allow event submissions</span></label>
          <label className="toggle-field"><input name="registrationEnabled" type="checkbox" checked={settings.registrationEnabled} onChange={updateSetting} /><span>Show registration actions</span></label>
          <label className="form-field"><span>Maintenance message</span><textarea name="maintenanceMessage" value={settings.maintenanceMessage} maxLength="300" onChange={updateSetting} /></label>
          <label className="form-field"><span>Change reason</span><textarea value={changeReason} minLength="5" maxLength="240" required onChange={(event) => setChangeReason(event.target.value)} placeholder="Explain the operational reason for this change." /></label>
          <button className="primary-button" type="submit" disabled={state.working}>{state.working ? 'Publishing…' : 'Publish new version'}</button>
        </form>
        <section className="history-card">
          <div className="history-heading"><div><h2>Version history</h2><p>{history.length} archived versions</p></div><button className="secondary-button" type="button" onClick={downloadAudit}>Download CSV</button></div>
          <label className="form-field restore-reason"><span>Restore reason</span><input value={restoreReason} minLength="5" maxLength="240" onChange={(event) => setRestoreReason(event.target.value)} placeholder="Required before restoring a version" /></label>
          <div className="history-list">
            {history.map((item) => (
              <article className="history-item" key={item.id}>
                <div><strong>Version {item.version}</strong><span>{item.action}</span></div>
                <p>{item.changeReason}</p>
                <small>{item.changedBy?.name ?? 'Administrator'} · {new Date(item.createdAt).toLocaleString('en-IN')}</small>
                <button className="text-button" type="button" disabled={state.working || restoreReason.trim().length < 5 || item.version === configuration.version} onClick={() => restore(item.version)}>Restore this version</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
