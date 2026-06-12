import express from 'express'
import Message from '../models/Message.js'

const router = express.Router()

// GET all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean()
    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// POST a new message
router.post('/messages', async (req, res) => {
  try {
    console.log('POST /api/messages body:', req.body)
    const { username, message, lat, lng, countryName, countryKey, locationName, mood } = req.body

    // Validate required fields
    if (!username || !message || lat === undefined || lng === undefined || !countryName || !countryKey || !locationName || !mood) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate mood
    const validMoods = ['neutral', 'angry', 'cry', 'suspicious']
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ error: 'Invalid mood' })
    }

    const newMessage = new Message({
      username,
      message,
      lat,
      lng,
      countryName,
      countryKey,
      locationName,
      mood,
    })

    await newMessage.save()
    console.log('Saved message id:', newMessage._id)
    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ error: 'Failed to create message' })
  }
})

// GET a specific message by ID
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).lean()
    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }
    res.json(message)
  } catch (error) {
    console.error('Error fetching message:', error)
    res.status(500).json({ error: 'Failed to fetch message' })
  }
})

// DELETE a message by ID
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }
    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
})

export default router
