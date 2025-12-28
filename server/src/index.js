import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createRouter as createAssignmentsRouter } from './routes/assignments.js'
import { createRouter as createExecuteRouter } from './routes/execute.js'
import { createRouter as createHintsRouter } from './routes/hints.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'CipherSQLStudio', time: new Date().toISOString() })
})

app.use('/api/assignments', createAssignmentsRouter())
app.use('/api/execute', createExecuteRouter())
app.use('/api/hints', createHintsRouter())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})