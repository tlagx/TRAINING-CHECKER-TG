// Import node-fetch for making HTTP requests
import fetch from 'node-fetch'

// Define the base URLs from environment variables
const TRAINING_API_BASE = process.env.TRAINING_API_URL || 'https://training-server.com'
const CHRONO_API_BASE = process.env.CHRONO_API_URL || 'https://chrono.czo.ooo'

// Export training API client
export const trainingApiClient = {
  get: async (endpoint: string) => {
    const url = `${TRAINING_API_BASE}${endpoint}`
    console.log(`Fetching from training API: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`)
    }
    
    return response.json()
  }
}

// Export chrono API client
export const chronoApiClient = {
  get: async (endpoint: string) => {
    const url = `${CHRONO_API_BASE}${endpoint}`
    console.log(`Fetching from chrono API: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`)
    }
    
    return response.json()
  }
}
