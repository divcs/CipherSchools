function normalizeRows(rows) {
  return rows.map(r => {
    const o = {}
    for (const k of Object.keys(r)) {
      o[k] = typeof r[k] === 'number' ? Number(r[k]) : r[k]
    }
    return o
  })
}

export function verifyOutput(actualRows, expected) {
  if (!expected) return { status: 'unknown' }
  const type = expected.type
  const value = expected.value
  if (type === 'table') {
    const a = normalizeRows(actualRows)
    const b = normalizeRows(value)
    const sameLength = a.length === b.length
    const sameContent = sameLength && a.every((row, i) => {
      const expectedRow = b[i]
      const keys = Object.keys(expectedRow)
      return keys.every(k => row[k] === expectedRow[k])
    })
    return { status: sameContent ? 'match' : 'mismatch', expected: b }
  }
  if (type === 'single_value' || type === 'count') {
    const cell = actualRows?.[0]?.[Object.keys(actualRows[0] || {})[0] || '']
    const ok = Number.isFinite(value) ? Math.abs(Number(cell) - Number(value)) < 1e-6 : cell === value
    return { status: ok ? 'match' : 'mismatch', expected: value }
  }
  if (type === 'column') {
    const colName = Object.keys(actualRows[0] || {})[0]
    const arr = actualRows.map(r => r[colName])
    const ok = arr.length === value.length && arr.every((v, i) => v === value[i])
    return { status: ok ? 'match' : 'mismatch', expected: value }
  }
  return { status: 'unknown' }
}