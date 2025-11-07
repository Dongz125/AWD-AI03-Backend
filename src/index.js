require('dotenv').config()
require('./config/postgreDb.js')

const cors = require('cors')
const express = require('express')
const router = require('./routes/index.js')

const app = express()

// middlewares
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
