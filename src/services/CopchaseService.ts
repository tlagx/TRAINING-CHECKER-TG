import { chronoApiClient } from '../api/axios'

export const fetchCopchaseLobbies = async () => {
  const response = await chronoApiClient.get('/copchase')
  return response.data
}
