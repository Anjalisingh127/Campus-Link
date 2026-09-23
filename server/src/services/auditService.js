import { AuditLog } from '../models/AuditLog.js';

export function recordEventAction({ action, event, actor, changes = [] }) {
  const pastTense = action.split('.')[1];
  return AuditLog.create({
    action,
    resourceType: 'event',
    resourceId: event.id ?? event._id.toString(),
    description: `Event "${event.title}" was ${pastTense}`,
    actor: actor.id ?? actor._id,
    actorSnapshot: { name: actor.name, email: actor.email },
    metadata: {
      eventTitle: event.title,
      eventStatus: event.status,
      changedFields: changes,
    },
  });
}

export async function listAuditLogs(query) {
  const filter = {};
  if (query.action) filter.action = query.action;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = query.from;
    if (query.to) filter.createdAt.$lte = query.to;
  }

  const skip = (query.page - 1) * query.limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(query.limit),
    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

export async function getAuditSummary() {
  const grouped = await AuditLog.aggregate([
    { $group: { _id: '$action', count: { $sum: 1 } } },
  ]);
  const actions = Object.fromEntries(grouped.map((item) => [item._id, item.count]));
  return {
    total: grouped.reduce((sum, item) => sum + item.count, 0),
    actions: {
      'event.created': actions['event.created'] ?? 0,
      'event.updated': actions['event.updated'] ?? 0,
      'event.deleted': actions['event.deleted'] ?? 0,
    },
  };
}

export function getAuditLogsForExport() {
  return AuditLog.find({}).sort({ createdAt: -1, _id: -1 }).lean();
}
