export default function SampleDataViewer({ tables }) {
  return (
    <div className="sample">
      {tables.map((t, i) => (
        <div className="sample__table" key={i}>
          <div className="sample__head">
            <h3 className="sample__title">{t.tableName}</h3>
            <code className="sample__schema">(
              {t.columns.map(c => `${c.columnName}:${c.dataType}`).join(', ')}
            )</code>
          </div>
          <div className="sample__body">
            <table className="table table--compact">
              <thead>
                <tr>
                  {t.columns.map(c => <th key={c.columnName}>{c.columnName}</th>)}
                </tr>
              </thead>
              <tbody>
                {(t.rows || []).map((r, ri) => (
                  <tr key={ri}>
                    {t.columns.map(c => <td key={c.columnName}>{String(r[c.columnName])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}