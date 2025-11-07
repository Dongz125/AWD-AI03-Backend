const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
})

pool.connect()
    .then((client) => {
        console.log('✅ Kết nối thành công đến PostgreSQL database!')
        client.release() // trả connection lại pool
    })
    .catch((err) => {
        console.error('❌ Lỗi khi kết nối đến database:', err.message)
    })

module.exports = { pool }
