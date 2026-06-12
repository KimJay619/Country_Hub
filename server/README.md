# Country Hub Backend Server

Express.js backend server for the Country Hub application that handles message persistence with MongoDB Atlas.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

The `.env` file has already been created with your MongoDB connection details:

```
MONGODB_URI=mongodb+srv://Poooop:bqYba9heXUcUig1s@cluster0.yicpo.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET /api/messages
Retrieves all stored messages.

**Response:**
```json
[
  {
    "_id": "mongodb_id",
    "username": "You",
    "message": "Hello world!",
    "lat": 40.7128,
    "lng": -74.006,
    "countryName": "United States",
    "countryKey": "USA",
    "locationName": "New York City",
    "mood": "neutral",
    "createdAt": "2026-06-05T10:30:00Z",
    "updatedAt": "2026-06-05T10:30:00Z"
  }
]
```

### POST /api/messages
Creates a new message.

**Request Body:**
```json
{
  "username": "You",
  "message": "Your message here",
  "lat": 40.7128,
  "lng": -74.006,
  "countryName": "United States",
  "countryKey": "USA",
  "locationName": "New York City",
  "mood": "neutral"
}
```

**Response:** Returns the created message with MongoDB `_id`

### GET /api/messages/:id
Retrieves a specific message by ID.

### DELETE /api/messages/:id
Deletes a message by ID.

## Frontend Integration

The React frontend is configured to communicate with this backend at `http://localhost:5000/api`.

When the app loads:
1. It fetches all existing messages from the database
2. When a user submits a new message, it POSTs to the backend
3. The server stores it in MongoDB and returns the saved document
4. The frontend displays all messages on the map

## MongoDB Collections

### messages
Stores all user-created country messages with timestamps for sorting and filtering.

**Schema:**
- `_id`: MongoDB ObjectId (auto-generated)
- `username`: String
- `message`: String
- `lat`: Number
- `lng`: Number
- `countryName`: String
- `countryKey`: String
- `locationName`: String
- `mood`: String (enum: 'neutral', 'angry', 'cry', 'suspicious')
- `createdAt`: Date (auto-set)
- `updatedAt`: Date (auto-set)

## Troubleshooting

### Connection Errors
If you see MongoDB connection errors:
1. Verify the MongoDB URI in `.env` is correct
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Check your internet connection

### CORS Issues
The server has CORS enabled for all origins. If you need to restrict it, modify the `server.js` file:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
}))
```

### Port Already in Use
If port 5000 is already in use, change the PORT in `.env`:
```
PORT=3001
```

Then update the frontend's `.env` VITE_API_URL accordingly.
