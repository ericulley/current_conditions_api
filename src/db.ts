import { Pool } from 'pg'

const pool: Pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'current_conditions',
})

export default pool