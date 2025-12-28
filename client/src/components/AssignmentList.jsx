import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AssignmentList() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    fetch('/api/assignments')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        setItems(data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="list">Loading assignments...</div>
  return (
    <section className="list" data-testid="assignment-list">
      <h2 className="list__title">Assignments</h2>
      <div className="list__grid">
        {items.map((a, i) => (
          <article key={i} className={`card card--${(a.description || '').toLowerCase()}`}>
            <header className="card__header">
              <h3 className="card__title">{a.title}</h3>
              <span className="badge">{a.description}</span>
            </header>
            <p className="card__desc">{a.question}</p>
            <button className="btn btn--primary" onClick={() => navigate(`/attempt/${i}`)}>Attempt</button>
          </article>
        ))}
      </div>
    </section>
  )
}