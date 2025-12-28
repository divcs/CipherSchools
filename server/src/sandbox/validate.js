const FORBIDDEN = [/\binsert\b/i, /\bupdate\b/i, /\bdelete\b/i, /\bdrop\b/i, /\balter\b/i, /\btruncate\b/i, /\bcreate\b(?!\s+schema)/i]

export function sanitizeSql(sql) {
  if (!sql || typeof sql !== 'string') return { ok: false, reason: 'SQL must be a string' }
  for (const re of FORBIDDEN) {
    if (re.test(sql)) {
      return { ok: false, reason: 'Only read-only queries are allowed in the sandbox' }
    }
  }
  return { ok: true }
}