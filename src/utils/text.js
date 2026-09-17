export function normalizeNumber(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}

export function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function safeText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}
