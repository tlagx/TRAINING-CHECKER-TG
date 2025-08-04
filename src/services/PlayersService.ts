import { trainingApiClient } from '../api/axios.js'

export const fetchPlayersOnline = async () => {
  const response: any = await trainingApiClient.get('/api/online')
  // Handle different response structures
  if (response.data && response.data.data) {
    return response.data.data
  }
  return response.data || response
}
