export default function ResultsTable({ rows }) {
  if (!rows || rows.length === 0) return <div className="results">No rows</div>
  const columns = Object.keys(rows[0])
  return (
    <div className="results">
      <table className="table">
        <thead>
          <tr>
            {columns.map(c => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map(c => <td key={c}>{String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}