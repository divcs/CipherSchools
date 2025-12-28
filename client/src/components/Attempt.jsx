import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import SqlEditor from './SqlEditor.jsx'
import ResultsTable from './ResultsTable.jsx'
import SampleDataViewer from './SampleDataViewer.jsx'
import HintBar from './HintBar.jsx'
import { apiUrl } from '../lib/api.js'

export default function Attempt() {
  const { index } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [sql, setSql] = useState('SELECT * FROM employees;')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(apiUrl(`/api/assignments/${index}`))
      .then(r => r.json())
      .then(setAssignment)
  }, [index])

  const onRun = async () => {
    if (!assignment) return
    setError('')
    setResult(null)
    const res = await fetch(apiUrl('/api/execute'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment, sql, workspaceId: `workspace_${index}` })
    }).then(r => r.json())
    if (res.error) { setError(res.error); return }
    setResult(res)
  }

  const onHint = async () => {
    if (!assignment) return
    const res = await fetch(apiUrl('/api/hints'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment, sql })
    }).then(r => r.json())
    setResult(r => ({ ...(r || {}), hint: res.hint }))
  }

  if (!assignment) return <div className="attempt">Loading...</div>
  return (
    <section className="attempt">
      <div className="attempt__question">
        <h2 className="attempt__title">{assignment.title}</h2>
        <p className="attempt__desc">{assignment.question}</p>
      </div>
      <div className="attempt__layout">
        <div className="attempt__left">
          <SampleDataViewer tables={assignment.sampleTables} />
        </div>
        <div className="attempt__right">
          <SqlEditor value={sql} onChange={setSql} />
          <div className="attempt__actions">
            <button className="btn btn--primary" onClick={onRun}>Run Query</button>
            <button className="btn" onClick={onHint}>Get Hint</button>
          </div>
          {error && <div className="alert alert--error">{error}</div>}
          {result && <HintBar hint={result.hint} verification={result.verification} />}
          {result && <ResultsTable rows={result.rows} />}
        </div>
      </div>
    </section>
  )
}