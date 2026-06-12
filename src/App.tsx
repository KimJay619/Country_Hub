import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Message, Mood, UserPin } from './IMessage'
import { countryBallSrc, getBrowserLocaleCountry, getRandomPlaceInCountry, resolveCountryKey } from './messageHelpers'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapComponent({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMap()

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom())
    }

    map.on('zoomend', handleZoom)
    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map, onZoomChange])

  return null
}

function App() {
  const [zoom, setZoom] = useState(2)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [userPins] = useState<UserPin[]>([
    {
      id: '1',
      lat: 40.7128,
      lng: -74.006,
      username: 'John NYC',
      comment: 'Great city with amazing views!',
    },
    {
      id: '2',
      lat: 51.5074,
      lng: -0.1278,
      username: 'Sarah London',
      comment: 'Love the culture and history here',
    },
    {
      id: '3',
      lat: 35.6762,
      lng: 139.6503,
      username: 'Tanaka Tokyo',
      comment: 'Most vibrant place Ive ever been',
    },
    {
      id: '4',
      lat: 48.8566,
      lng: 2.3522,
      username: 'Marie Paris',
      comment: 'City of lights and romance',
    },
    {
      id: '5',
      lat: -33.8688,
      lng: 151.2093,
      username: 'Alex Sydney',
      comment: 'Beautiful beaches and weather',
    },
  ])
  const [userCountryName, setUserCountryName] = useState<string | null>(null)
  const [userCountryKey, setUserCountryKey] = useState<string>('Empty')
  const [countryballMood, setCountryballMood] = useState<Mood>('neutral')
  const [showMessageBox, setShowMessageBox] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectError, setDetectError] = useState<string | null>(null)
  const [lastSubmitAt, setLastSubmitAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const moodOptions: Mood[] = ['neutral', 'angry', 'cry', 'suspicious']
  const isZoomedIn = zoom >= 5
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const detectCountry = async () => {
    setIsDetecting(true)
    setDetectError(null)

    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      const country = (data.country_name || data.country || 'Unknown').toString()
      const resolvedKey = resolveCountryKey(country)

      setUserCountryName(country)
      setUserCountryKey(resolvedKey)
      setShowMessageBox(true)
    } catch (error) {
      const fallbackKey = getBrowserLocaleCountry(navigator.language || '') || 'Empty'
      setUserCountryName(fallbackKey === 'Empty' ? 'Unknown' : fallbackKey)
      setUserCountryKey(fallbackKey)
      setShowMessageBox(true)
      setDetectError('Could not detect your country from network. Using browser locale or fallback.')
    } finally {
      setIsDetecting(false)
    }
  }
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/messages`)
        if (!res.ok) return
        const data = await res.json()
        // Normalize messages to always have an `id` field (use `_id` from backend if present)
        const normalized = data.map((m: any) => ({ ...m, id: m.id || m._id }))
        setMessages(normalized)
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }
    fetchMessages()

    const storedSubmitAt = localStorage.getItem('lastSubmitAt')
    if (storedSubmitAt) {
      setLastSubmitAt(Number(storedSubmitAt))
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const COOLDOWN_MS = 5 * 60 * 1000
  const cooldownRemaining = lastSubmitAt ? Math.max(0, COOLDOWN_MS - (now - lastSubmitAt)) : 0
  const isCooldownActive = cooldownRemaining > 0

  const handleSubmit = async () => {
    if (isCooldownActive) return
    if (!messageText.trim()) return

    const place = getRandomPlaceInCountry(userCountryKey)
    const payload = {
      username: 'You',
      message: messageText,
      lat: place.coords[0],
      lng: place.coords[1],
      countryName: userCountryName || 'Unknown',
      countryKey: userCountryKey,
      locationName: place.name,
      mood: countryballMood,
    }

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Server error:', err)
        return
      }

      const saved = await res.json()
      const normalizedSaved = { ...saved, id: saved.id || saved._id }
      setMessages((prev) => [normalizedSaved, ...prev])
      setMessageText('')
      const now = Date.now()
      setLastSubmitAt(now)
      localStorage.setItem('lastSubmitAt', now.toString())
    } catch (err) {
      console.error('Failed to submit message:', err)
    }
  }

  const handleCancel = () => {
    setMessageText('')
  }

  return (
    <div className="app-container">
      <div className="map-section">
        <div className="zoom-info">
          Current Zoom: {zoom} | {isZoomedIn ? 'Zoomed In - Comments Visible' : 'Zoomed Out - Pins Only'}
        </div>
        <MapContainer
          center={[20, 0]}
          zoom={zoom}
          maxZoom={10}
          minZoom={2}
          maxBounds={[[ -90, -180 ], [90, 180]]}
          maxBoundsViscosity={1.0}
          className="map"
        >
          <MapComponent onZoomChange={setZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {userPins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]}>
              {isZoomedIn ? (
                <Popup>
                  <div className="popup-content">
                    <h4>{pin.username}</h4>
                    <p>{pin.comment}</p>
                  </div>
                </Popup>
              ) : null}
            </Marker>
          ))}

          {messages.map((msg) => (
            <Marker key={msg.id || msg._id} position={[msg.lat, msg.lng]}>
              {isZoomedIn ? (
                <Popup>
                  <div className="popup-content">
                    <img
                      className="popup-emoji"
                      src={countryBallSrc(msg.countryKey, msg.mood)}
                      alt={`${msg.countryName} countryball`}
                    />
                    <h5>{msg.locationName ? `${msg.locationName} — ${msg.countryName}` : msg.countryName}</h5>
                    <p className="popup-user"><strong>{msg.username || 'Someone'}:</strong> {msg.message}</p>
                  </div>
                </Popup>
              ) : null}
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="message-section">
        <div className="message-header">
          <h2>Send Country Message</h2>
          <button className="detect-btn" onClick={detectCountry} disabled={isDetecting}>
            {isDetecting ? 'Detecting...' : 'Detect my country'}
          </button>
        </div>

        <div className="message-body">
          <div className="country-status">
            {showMessageBox ? (
              <>
                <div>
                  <strong>Country:</strong> {userCountryName || 'Unknown'}
                </div>
                <img
                  className="countryball-preview"
                  src={countryBallSrc(userCountryKey, countryballMood)}
                  alt="Selected countryball"
                />
              </>
            ) : (
              <span>Click the button to detect your network country and reveal the message box.</span>
            )}
          </div>

          {detectError ? <div className="error-text">{detectError}</div> : null}

          {showMessageBox && (
            <>
              <div className="mood-selection">
                <span>Select countryball mood:</span>
                <div className="mood-options">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      className={mood === countryballMood ? 'mood-button selected' : 'mood-button'}
                      onClick={() => setCountryballMood(mood)}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="message-input-section">
                <textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="message-input"
                  rows={5}
                />
                <div className="button-group">
                  <button onClick={handleSubmit} className="submit-btn" disabled={isCooldownActive || !messageText.trim()}>
                    {isCooldownActive ? `Wait ${Math.ceil(cooldownRemaining / 1000)}s` : 'Submit'}
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
                {isCooldownActive ? (
                  <div className="cooldown-text">
                    You can send another message in {Math.ceil(cooldownRemaining / 1000)} seconds.
                  </div>
                ) : null}
              </div>
            </>
          )}

          <div className="instructions">
            Zoom in to see message popups with countryball icons. Zoom out to see pins only.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
