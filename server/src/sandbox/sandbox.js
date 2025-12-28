import { Pool } from 'pg'
import { newDb } from 'pg-mem'

const pgConnectionString = process.env.PG_CONNECTION_STRING

function normalizeType(type) {
  const t = String(type).toUpperCase()
  if (t === 'INTEGER' || t === 'INT') return 'INT'
  if (t === 'REAL' || t === 'FLOAT' || t === 'DOUBLE') return 'REAL'
  return 'TEXT'
}

function buildCreateTableSQL(tableName, columns) {
  const cols = columns.map(c => `${c.columnName} ${normalizeType(c.dataType)}`).join(', ')
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${cols});`
}

function buildInsertSQL(tableName, row) {
  const keys = Object.keys(row)
  const cols = keys.join(', ')
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
  return { sql: `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders});`, values: keys.map(k => row[k]) }
}

export async function getSandbox(workspaceId) {
  if (pgConnectionString) {
    const pool = new Pool({ connectionString: pgConnectionString })
    const schema = workspaceId
    return {
      async prepare(sampleTables) {
        const client = await pool.connect()
        try {
          await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`)
          await client.query(`SET search_path TO ${schema};`)
          for (const t of sampleTables) {
            await client.query(buildCreateTableSQL(t.tableName, t.columns))
            for (const row of t.rows || []) {
              const { sql, values } = buildInsertSQL(t.tableName, row)
              await client.query(sql, values)
            }
          }
        } finally {
          client.release()
        }
      },
      async query(sql) {
        const client = await pool.connect()
        try {
          await client.query(`SET search_path TO ${schema};`)
          const res = await client.query(sql)
          return res
        } finally {
          client.release()
        }
      },
    }
  }

  const db = newDb()
  db.public.none('CREATE SCHEMA workspace_demo;')
  const schema = workspaceId
  if (schema !== 'public') db.public.none(`CREATE SCHEMA ${schema};`)
  const pgMem = db.adapters.createPg()
  const pool = new pgMem.Pool()

  return {
    async prepare(sampleTables) {
      const client = await pool.connect()
      try {
        await client.query(`SET search_path TO ${schema};`)
        for (const t of sampleTables) {
          await client.query(buildCreateTableSQL(t.tableName, t.columns))
          for (const row of t.rows || []) {
            const { sql, values } = buildInsertSQL(t.tableName, row)
            await client.query(sql, values)
          }
        }
      } finally {
        client.release()
      }
    },
    async query(sql) {
      const client = await pool.connect()
      try {
        await client.query(`SET search_path TO ${schema};`)
        const res = await client.query(sql)
        return res
      } finally {
        client.release()
      }
    },
  }
}