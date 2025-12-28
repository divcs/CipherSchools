import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

const seedsPath = path.resolve(process.cwd(), 'src', 'seeds', 'assignments.json')

const AssignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  question: String,
  sampleTables: [
    {
      tableName: String,
      columns: [
        {
          columnName: String,
          dataType: String,
        },
      ],
      rows: mongoose.Schema.Types.Mixed,
    },
  ],
  expectedOutput: {
    type: { type: String },
    value: mongoose.Schema.Types.Mixed,
  },
  createdAt: Date,
  updatedAt: Date,
})

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema)

function readSeeds() {
  try {
    const raw = fs.readFileSync(seedsPath, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export function createRouter() {
  const router = Router()

  router.get('/', async (req, res) => {
    const useMongo = !!process.env.MONGO_URI
    if (useMongo) {
      try {
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGO_URI)
        }
        const docs = await Assignment.find({}).lean()
        return res.json({ source: 'mongo', items: docs })
      } catch (err) {
        console.error('Mongo error', err)
      }
    }
    const items = readSeeds()
    res.json({ source: 'seeds', items })
  })

  router.get('/:index', (req, res) => {
    const items = readSeeds()
    const idx = Number(req.params.index)
    if (Number.isNaN(idx) || idx < 0 || idx >= items.length) {
      return res.status(404).json({ error: 'Assignment not found' })
    }
    res.json(items[idx])
  })

  return router
}