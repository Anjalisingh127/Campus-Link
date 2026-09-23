import { ConfigurationVersion } from '../models/ConfigurationVersion.js';
import { DEFAULT_PLATFORM_SETTINGS, PlatformConfiguration } from '../models/PlatformConfiguration.js';
import { AppError } from '../utils/AppError.js';

const CONFIGURATION_KEY = 'platform';

function copySettings(settings) {
  return JSON.parse(JSON.stringify(settings));
}

async function archive(configuration, action, changedBy, sourceVersion) {
  return ConfigurationVersion.create({
    configurationKey: CONFIGURATION_KEY,
    version: configuration.version,
    settings: copySettings(configuration.settings),
    action,
    sourceVersion,
    changeReason: configuration.changeReason,
    changedBy,
  });
}

export async function getConfiguration() {
  const existing = await PlatformConfiguration.findOne({ key: CONFIGURATION_KEY });
  if (existing) return existing;
  return {
    key: CONFIGURATION_KEY,
    version: 0,
    settings: { ...DEFAULT_PLATFORM_SETTINGS },
    changeReason: 'Default application configuration',
  };
}

export async function updateConfiguration(settings, changeReason, userId) {
  let configuration = await PlatformConfiguration.findOne({ key: CONFIGURATION_KEY });
  const action = configuration ? 'updated' : 'created';

  if (!configuration) {
    configuration = await PlatformConfiguration.create({
      key: CONFIGURATION_KEY,
      version: 1,
      settings,
      updatedBy: userId,
      changeReason,
    });
  } else {
    configuration.settings = settings;
    configuration.version += 1;
    configuration.updatedBy = userId;
    configuration.changeReason = changeReason;
    await configuration.save();
  }

  await archive(configuration, action, userId);
  return configuration;
}

export async function listHistory({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [versions, total] = await Promise.all([
    ConfigurationVersion.find({ configurationKey: CONFIGURATION_KEY })
      .sort({ version: -1 })
      .skip(skip)
      .limit(limit)
      .populate('changedBy', 'name email role'),
    ConfigurationVersion.countDocuments({ configurationKey: CONFIGURATION_KEY }),
  ]);
  return { versions, pagination: { page, limit, total, pages: total === 0 ? 0 : Math.ceil(total / limit) } };
}

export function getHistoryForExport() {
  return ConfigurationVersion.find({ configurationKey: CONFIGURATION_KEY })
    .sort({ version: -1 })
    .populate('changedBy', 'name email role');
}

export async function restoreConfiguration(sourceVersion, changeReason, userId) {
  const snapshot = await ConfigurationVersion.findOne({
    configurationKey: CONFIGURATION_KEY,
    version: sourceVersion,
  });
  if (!snapshot) throw new AppError(404, 'CONFIGURATION_VERSION_NOT_FOUND', 'Configuration version was not found');

  const current = await PlatformConfiguration.findOne({ key: CONFIGURATION_KEY });
  const nextVersion = (current?.version ?? 0) + 1;
  const configuration = current ?? new PlatformConfiguration({ key: CONFIGURATION_KEY });
  configuration.version = nextVersion;
  configuration.settings = copySettings(snapshot.settings);
  configuration.updatedBy = userId;
  configuration.changeReason = changeReason;
  await configuration.save();
  await archive(configuration, 'restored', userId, sourceVersion);
  return configuration;
}
