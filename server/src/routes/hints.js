import { Router } from 'express'

function heuristicHint({ question, sampleTables, sql }) {
  const text = (sql || '').toLowerCase()
  if (/highest.*salary/.test(question.toLowerCase())) {
    if (!/max\(salary\)/.test(text) && !/order by.*salary.*desc/.test(text)) {
      return 'Consider using MAX(salary) or ORDER BY salary DESC with LIMIT/WHERE to select highest earners. Handle ties.'
    }
  }
  if (/number of employees|count/.test(question.toLowerCase())) {
    if (!/group by/.test(text) || !/count\(/.test(text)) {
      return 'Aggregate by department using COUNT(*) and GROUP BY department. Optionally ORDER BY department.'
    }
  }
  if (/total order value/.test(question.toLowerCase())) {
    if (!/join/.test(text) || !/sum\(/.test(text)) {
      return 'JOIN customers with orders on customers.id = orders.customer_id and SUM(amount) grouped by customer.'
    }
  }
  if (/more than\s*50,?000|more than 50000/.test(question.toLowerCase())) {
    if (!/where/.test(text)) {
      return 'Filter rows using WHERE salary > 50000. Select relevant columns.'
    }
  }
  return 'Check column names and required aggregation. Add WHERE/JOIN/GROUP BY clauses as needed.'
}

export function createRouter() {
  const router = Router()
  router.post('/', async (req, res) => {
    const { assignment, sql } = req.body || {}
    if (!assignment) return res.status(400).json({ error: 'assignment is required' })
    const hint = heuristicHint({ question: assignment.question, sampleTables: assignment.sampleTables, sql })
    res.json({ hint })
  })
  return router
}