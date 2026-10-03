import { API_ORIGIN } from '../api/client';

// The backend stores/returns uploaded-image paths as origin-relative
// (e.g. "/uploads/categories/xxx.jpg"). The frontend and backend are served
// from different origins in production, so these need the backend's origin
// prepended before they're usable as an <img src>.
export function assetUrl(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('blob:') || path.startsWith('data:')) return path;
  return `${API_ORIGIN}${path}`;
}
