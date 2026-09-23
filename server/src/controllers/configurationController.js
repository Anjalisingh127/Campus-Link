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
