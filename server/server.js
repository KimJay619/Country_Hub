import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import messagesRouter from './routes/messages.js'
import Message from './models/Message.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
// Configure CORS: if FRONTEND_ORIGIN is set (production), allow only that origin.
// Otherwise allow all origins for local development.
const corsOptions = process.env.FRONTEND_ORIGIN ? { origin: process.env.FRONTEND_ORIGIN } : undefined
app.use(cors(corsOptions))
app.use(express.json())

// MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in environment')
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected:', conn.connection.host, 'db:', conn.connection.name)

    // Ensure indexes are synced, including the TTL index update
    await Message.syncIndexes()
    console.log('Message indexes synced')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

// Connect to database
connectDB()

// Routes
app.use('/api', messagesRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Serve static files from the frontend dist on production
app.use(express.static(path.join(__dirname, '..', 'dist')))
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
