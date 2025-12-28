# CipherSQLStudio — Run Instructions

## Overview
- React client and Express backend
- Assignments loaded from `server/src/seeds/assignments.json`
- Queries execute in an in-memory PostgreSQL sandbox by default

## Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- Git
- PowerShell or any terminal

## Backend
1. Install dependencies:
   ```powershell
   cd server
   npm install
   ```
2. Run the server:
   ```powershell
   npm run dev
   ```
3. Verify:
   - Health: `http://localhost:5000/api/health`
   - Info: `http://localhost:5000/`
   - Assignments: `http://localhost:5000/api/assignments`

## Frontend
1. Install dependencies:
   ```powershell
   cd ../client
   npm install
   ```
2. Run the client:
   ```powershell
   npm run dev
   ```
3. Open the printed local URL (typically `http://localhost:5174/`).

## Using the App
- On the Assignments page, click an item to attempt.
- In the editor, write SQL and click `Run Query`.
- A results table appears; a tag shows whether output matches the expected result.
- Click `Get Hint` for non-solution guidance.

### Sample Queries
- High salary:
  ```sql
  SELECT * FROM employees WHERE salary > 50000;
  ```
- Department counts:
  ```sql
  SELECT department, COUNT(*) AS count
  FROM employees
  GROUP BY department
  ORDER BY department;
  ```
- Total per customer:
  ```sql
  SELECT c.name, SUM(o.amount) AS total_amount
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name
  ORDER BY c.name;
  ```
- Highest paid:
  ```sql
  SELECT *
  FROM employees
  WHERE salary = (SELECT MAX(salary) FROM employees);
  ```

## Optional Environment Variables
Create `server/.env` if you want real services:
- `PG_CONNECTION_STRING` → use a real PostgreSQL; sandbox creates a per-workspace schema and inserts sample rows before running queries.
- `MONGO_URI` → load assignments from MongoDB instead of seeds.

## Troubleshooting
- Empty list in UI:
  - Ensure backend is running; check `http://localhost:5000/api/assignments` returns items
  - The client proxy to backend is set in `client/vite.config.js`
- Port 5000 in use:
  - Stop existing Node processes or start with another port:
    ```powershell
    set PORT=5001
    npm run dev
    ```
  - If the backend port changes, update the proxy target in `client/vite.config.js`
- Node version warnings:
  - Use Node 18+; the client’s Vite/plugin versions are pinned for compatibility

