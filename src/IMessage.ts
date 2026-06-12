export type Mood = 'neutral' | 'angry' | 'cry' | 'suspicious'

export interface Message {
  id: string
  username: string
  message: string
  lat: number
  lng: number
  countryName: string
  countryKey: string
  locationName: string
  mood: Mood
  _id?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserPin {
  id: string
  lat: number
  lng: number
  username: string
  comment: string
}
