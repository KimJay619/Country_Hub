import type { Mood } from './IMessage'

export const countryCenters: Record<string, [number, number]> = {
  USA: [38, -97],
  Uk: [54, -2],
  China: [35, 103],
  Germany: [51, 10],
  India: [21, 78],
  Indonesia: [-2.5, 118],
  Japan: [36, 138],
  Mexico: [23, -102],
  Philippines: [13, 122],
  Brazil: [-10, -55],
  Empty: [0, 0],
}

export interface CountryPlace {
  name: string
  coords: [number, number]
}

const countryPlaces: Record<string, CountryPlace[]> = {
  USA: [
    { name: 'New York City', coords: [40.7128, -74.006] },
    { name: 'Los Angeles', coords: [34.0522, -118.2437] },
    { name: 'Chicago', coords: [41.8781, -87.6298] },
  ],
  Uk: [
    { name: 'London', coords: [51.5074, -0.1278] },
    { name: 'Manchester', coords: [53.4808, -2.2426] },
    { name: 'Birmingham', coords: [52.4862, -1.8904] },
    { name: 'Glasgow', coords: [55.8642, -4.2518] },
  ],
  China: [
    { name: 'Beijing', coords: [39.9042, 116.4074] },
    { name: 'Shanghai', coords: [31.2304, 121.4737] },
    { name: 'Guangzhou', coords: [23.1291, 113.2644] },
    { name: 'Shenzhen', coords: [22.5431, 114.0579] },
  ],
  Germany: [
    { name: 'Berlin', coords: [52.5200, 13.4050] },
    { name: 'Munich', coords: [48.1351, 11.5820] },
    { name: 'Hamburg', coords: [53.5511, 9.9937] },
    { name: 'Frankfurt', coords: [50.1109, 8.6821] },
  ],
  India: [
    { name: 'Mumbai', coords: [19.0760, 72.8777] },
    { name: 'Delhi', coords: [28.7041, 77.1025] },
    { name: 'Bengaluru', coords: [12.9716, 77.5946] },
    { name: 'Kolkata', coords: [22.5726, 88.3639] },
  ],
  Indonesia: [
    { name: 'Jakarta', coords: [-6.2088, 106.8456] },
    { name: 'Surabaya', coords: [-7.2575, 112.7521] },
    { name: 'Bandung', coords: [-6.9175, 107.6191] },
    { name: 'Medan', coords: [3.5952, 98.6722] },
  ],
  Japan: [
    { name: 'Tokyo', coords: [35.6762, 139.6503] },
    { name: 'Osaka', coords: [34.6937, 135.5023] },
    { name: 'Nagoya', coords: [35.1815, 136.9066] },
    { name: 'Sapporo', coords: [43.0621, 141.3544] },
  ],
  Mexico: [
    { name: 'Mexico City', coords: [19.4326, -99.1332] },
    { name: 'Guadalajara', coords: [20.6597, -103.3496] },
    { name: 'Monterrey', coords: [25.6866, -100.3161] },
    { name: 'Puebla', coords: [19.0433, -98.1985] },
  ],
  Philippines: [
    { name: 'Manila', coords: [14.5995, 120.9842] },
    { name: 'Cebu City', coords: [10.3157, 123.8854] },
    { name: 'Davao City', coords: [7.1907, 125.4553] },
    { name: 'Zamboanga', coords: [6.9214, 122.0790] },
  ],
  Brazil: [
    { name: 'São Paulo', coords: [-23.5505, -46.6333] },
    { name: 'Rio de Janeiro', coords: [-22.9068, -43.1729] },
    { name: 'Brasília', coords: [-15.7942, -47.8822] },
    { name: 'Salvador', coords: [-12.9777, -38.5016] },
  ],
  Empty: [{ name: 'Unknown Location', coords: [0, 0] }],
}

export function getRandomPlaceInCountry(countryKey: string) {
  const places = countryPlaces[countryKey]
  if (places && places.length > 0) {
    const chosen = places[Math.floor(Math.random() * places.length)]
    // Small jitter so multiple messages for the same named place don't overlap exactly
    const jitterSmall = (maxDeg: number) => (Math.random() - 0.5) * 2 * maxDeg
    const lat = +(chosen.coords[0] + jitterSmall(0.02)).toFixed(6)
    const lng = +(chosen.coords[1] + jitterSmall(0.02)).toFixed(6)
    return { name: chosen.name, coords: [lat, lng] }
  }

  // Fallback: return a randomized point near the country's center so messages don't stack
  const center = countryCenters[countryKey] || countryCenters.Empty
  const jitter = (maxDeg: number) => (Math.random() - 0.5) * 2 * maxDeg
  // Jitter up to ~0.6 degrees lat/lng for visible spread without leaving country
  const lat = +(center[0] + jitter(0.6)).toFixed(6)
  const lng = +(center[1] + jitter(0.6)).toFixed(6)
  return { name: `${countryKey} Center`, coords: [lat, lng] }
}

const countryBallAssets: Record<string, Record<Mood, string>> = {
  USA: {
    neutral: new URL('./assets/Countryball-faces/Neutral/USA-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/USA-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/USA-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/USA-suspicious.png', import.meta.url).href,
  },
  Uk: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Uk-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Uk-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Uk-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Uk-suspicious.png', import.meta.url).href,
  },
  China: {
    neutral: new URL('./assets/Countryball-faces/Neutral/China-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/China-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/China-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/China-suspicious.png', import.meta.url).href,
  },
  Germany: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Germany-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Germany-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Germany-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Germany-suspicious.png', import.meta.url).href,
  },
  India: {
    neutral: new URL('./assets/Countryball-faces/Neutral/India-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/India-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/India-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/India-suspicious.png', import.meta.url).href,
  },
  Indonesia: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Indonesia-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Indonesia-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Indonisia-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Indonesia-suspicious.png', import.meta.url).href,
  },
  Japan: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Japan-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Japan-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Japan-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Japan-suspicious.png', import.meta.url).href,
  },
  Mexico: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Mexico-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Mexico-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Mexico-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Mexico-suspicious.png', import.meta.url).href,
  },
  Philippines: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Philippines-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Philippines-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Philippines-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Philippines-suspicious.png', import.meta.url).href,
  },
  Brazil: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Brazil-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Brazil-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Brazil-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Brazil-suspicious.png', import.meta.url).href,
  },
  Empty: {
    neutral: new URL('./assets/Countryball-faces/Neutral/Empty-neutral.png', import.meta.url).href,
    angry: new URL('./assets/Countryball-faces/Angry/Empty-angry.png', import.meta.url).href,
    cry: new URL('./assets/Countryball-faces/Cry/Empty-cry.png', import.meta.url).href,
    suspicious: new URL('./assets/Countryball-faces/Suspicious/Empty-suspicious.png', import.meta.url).href,
  },
}

export function resolveCountryKey(countryName: string) {
  const test = countryName.toLowerCase()

  if (test.includes('united states') || test === 'us' || test === 'usa') return 'USA'
  if (test.includes('united kingdom') || test.includes('uk') || test.includes('britain') || test.includes('england')) return 'Uk'
  if (test.includes('china')) return 'China'
  if (test.includes('germany')) return 'Germany'
  if (test.includes('india')) return 'India'
  if (test.includes('indonesia')) return 'Indonesia'
  if (test.includes('japan')) return 'Japan'
  if (test.includes('mexico')) return 'Mexico'
  if (test.includes('philippines')) return 'Philippines'
  if (test.includes('brazil')) return 'Brazil'
  return 'Empty'
}

export function getBrowserLocaleCountry(locale: string) {
  const code = locale.split('-')[1] || locale
  if (!code) return null
  return resolveCountryKey(code)
}

export function countryBallSrc(countryKey: string, mood: Mood) {
  return countryBallAssets[countryKey]?.[mood] || countryBallAssets.Empty[mood]
}
