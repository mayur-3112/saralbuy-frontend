const OBJECT_ID = /^[a-f0-9]{24}$/i;

// API base is `<backend>/api/v1`; uploaded files are served from
// `<backend>/api/v1/files/:id`.
function filesBase() {
  const base = (import.meta.env.VITE_API_BACKEND_URL || '').replace(/\/$/, '');
  return `${base}/files`;
}

/**
 * Normalises a stored `document` value into an array of openable URLs.
 *
 * The field is historically a comma-joined string whose entries may be
 * full URLs (current uploads) or bare Mongo file IDs (legacy uploads).
 * Rendering the raw string as a single href produces broken
 * `/api/v1/files/id1,id2` requests — always resolve through this.
 */
export function resolveDocuments(document) {
  if (!document) return [];
  const parts = Array.isArray(document) ? document : String(document).split(',');
  return parts
    .map(p => (p || '').trim())
    .filter(Boolean)
    .map(p => (/^https?:\/\//i.test(p) ? p : OBJECT_ID.test(p) ? `${filesBase()}/${p}` : p));
}
