// Import node-fetch for making HTTP requests
import fetch from 'node-fetch'

// Define the base URLs from environment variables
const TRAINING_API_BASE = process.env.NEXT_PUBLIC_API_USER_URL?.replace('/api/user', '') || 'https://training-server.com'
const CHRONO_API_BASE = process.env.NEXT_PUBLIC_API_WORLDLIST_URL?.replace('/api/worlds', '') || 'https://chrono.czo.ooo'

// Export training API client
export const trainingApiClient = {
  get: async (endpoint: string) => {
    const url = `${TRAINING_API_BASE}${endpoint}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}

// Export chrono API client
export const chronoApiClient = {
  get: async (endpoint: string) => {
    const url = `${CHRONO_API_BASE}${endpoint}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}
