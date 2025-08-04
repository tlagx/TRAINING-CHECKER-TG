import { chronoApiClient } from '../api/axios.js'

export const fetchCopchaseLobbies = async () => {
  const response: any = await chronoApiClient.get('/api/copchase')
  // Handle different response structures
  if (response.data) {
    return response.data
  }
  return response
}
