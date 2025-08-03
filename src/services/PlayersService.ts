import { trainingApiClient } from '../api/axios'

export const fetchPlayersOnline = async () => {
  const response = await trainingApiClient.get('/online')
  return response.data.data
}
