import { Router } from 'express'
import { getSandbox } from '../sandbox/sandbox.js'
import { verifyOutput } from '../sandbox/verify.js'
import { sanitizeSql } from '../sandbox/validate.js'

export function createRouter() {
  const router = Router()

  router.post('/', async (req, res) => {
    const { assignment, sql, workspaceId = 'workspace_demo' } = req.body || {}
    if (!assignment || !sql) {
      return res.status(400).json({ error: 'assignment and sql are required' })
    }

    const validation = sanitizeSql(sql)
    if (!validation.ok) {
      return res.status(400).json({ error: validation.reason })
    }

    try {
      const sandbox = await getSandbox(workspaceId)
      await sandbox.prepare(assignment.sampleTables)
      const result = await sandbox.query(sql)
      const rows = result.rows || result

      const verification = verifyOutput(rows, assignment.expectedOutput)
      return res.json({ rows, columns: result.fields?.map(f => f.name) || Object.keys(rows[0] || {}), verification })
    } catch (err) {
      return res.status(200).json({ error: String(err.message || err) })
    }
  })

  return router
}