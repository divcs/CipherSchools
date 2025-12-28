export function apiUrl(path) {
  const base = import.meta.env.VITE_API_BASE_URL || ''
  if (base) return `${base.replace(/\/$/, '')}${path}`
  return path
}