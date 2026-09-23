import * as configurationService from '../services/configurationService.js';

export async function getConfiguration(req, res) {
  const configuration = await configurationService.getConfiguration();
  res.status(200).json({ data: configuration });
}

export async function updateConfiguration(req, res) {
  const configuration = await configurationService.updateConfiguration(
    req.body.settings,
    req.body.changeReason,
    req.user.id,
  );
  res.status(200).json({ data: configuration });
}

export async function listHistory(req, res) {
  const result = await configurationService.listHistory(req.configurationQuery);
  res.status(200).json({ data: result.versions, meta: result.pagination });
}

export async function restoreConfiguration(req, res) {
  const configuration = await configurationService.restoreConfiguration(
    req.configurationVersion,
    req.body.changeReason,
    req.user.id,
  );
  res.status(200).json({ data: configuration });
}

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function exportHistoryCsv(req, res) {
  const versions = await configurationService.getHistoryForExport();
  const headings = ['version', 'action', 'sourceVersion', 'changeReason', 'administrator', 'email', 'changedAt', 'settings'];
  const rows = versions.map((item) => [
    item.version,
    item.action,
    item.sourceVersion ?? '',
    item.changeReason,
    item.changedBy?.name ?? '',
    item.changedBy?.email ?? '',
    item.createdAt.toISOString(),
    JSON.stringify(item.settings),
  ].map(csvCell).join(','));
  const csv = [headings.map(csvCell).join(','), ...rows].join('\n');
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="configuration-history.csv"');
  res.status(200).send(csv);
}
