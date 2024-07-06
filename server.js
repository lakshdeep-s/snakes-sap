import express from 'express'
import path from 'path'
import getRootDirectory from './utils/getRootDirectory.js'
import http from 'http'

import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import pageRouter from './routes/pageRoutes.js'
import authRouter from './routes/authRoutes.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const __dirname = getRootDirectory(import.meta.url)

const app = express()
const server = http.createServer(app)

app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/styles', express.static(path.join(__dirname, 'src/styles')))
app.use('/scripts', express.static(path.join(__dirname, 'src/scripts')))

app.use("/", pageRouter)
app.use("/auth", authRouter)

server.listen(PORT, (req, res) => {
    console.log(`Server started on http://localhost:${PORT}`)
})