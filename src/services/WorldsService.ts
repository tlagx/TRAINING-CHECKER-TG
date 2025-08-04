import { chronoApiClient } from '../api/axios.js'

export const getWorlds = async () => {
  const response: any = await chronoApiClient.get('/api/worlds')
  // Handle different response structures
  if (response.data) {
    return response.data
  }
  return response
}
