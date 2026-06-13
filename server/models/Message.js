import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    countryKey: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ['neutral', 'angry', 'cry', 'suspicious'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Automatically remove messages 15 minutes after creation (TTL index)
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 })

const Message = mongoose.model('Message', messageSchema)

export default Message
