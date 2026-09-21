const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL must be configured');
}

export const env = Object.freeze({
  appName: import.meta.env.VITE_APP_NAME ?? 'CampusConnect',
  apiBaseUrl,
});
