import * as auditService from '../services/auditService.js';

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function listAuditLogs(req, res) {
  const result = await auditService.listAuditLogs(req.auditQuery);
  res.status(200).json({ data: result.logs, meta: result.pagination });
}

export async function getAuditSummary(req, res) {
  const summary = await auditService.getAuditSummary();
  res.status(200).json({ data: summary });
}

export async function exportAuditCsv(req, res) {
  const logs = await auditService.getAuditLogsForExport();
  const headings = ['action', 'resourceType', 'resourceId', 'description', 'administrator', 'email', 'changedAt', 'metadata'];
  const rows = logs.map((item) => [
    item.action,
    item.resourceType,
    item.resourceId,
    item.description,
    item.actorSnapshot?.name ?? '',
    item.actorSnapshot?.email ?? '',
    item.createdAt.toISOString(),
    JSON.stringify(item.metadata ?? {}),
  ].map(csvCell).join(','));
  const csv = [headings.map(csvCell).join(','), ...rows].join('\n');
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="event-audit-report.csv"');
  res.status(200).send(csv);
}
