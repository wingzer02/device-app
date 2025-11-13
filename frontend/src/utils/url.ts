const API_ORIGIN = process.env.REACT_APP_API_ORIGIN ?? 'http://localhost:8080';

export function toUploadsUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('/uploads/')) return `${API_ORIGIN}${path}`;
  return path;
}
