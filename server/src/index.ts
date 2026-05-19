import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import express from 'express'
import cors from 'cors'
import uploadRouter from './routes/upload'
import parseRouter from './routes/parse'
import generateRouter from './routes/generate'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }))
app.use(express.json({ limit: '5mb' }))

app.use('/api/upload', uploadRouter)
app.use('/api/parse', parseRouter)
app.use('/api/generate', generateRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
