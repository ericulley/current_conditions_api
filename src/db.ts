import { Pool } from 'pg'

const pool: Pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'wca_conditions',
})

export default pool