export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not set' : date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
