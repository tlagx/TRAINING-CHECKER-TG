import { chronoApiClient } from '../api/axios'

export const getWorlds = async () => {
  const response = await chronoApiClient.get('/worlds')
  return response.data
}
