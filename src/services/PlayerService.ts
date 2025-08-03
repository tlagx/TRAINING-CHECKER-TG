import { trainingApiClient } from '../api/axios'

export const getPlayer = async (nickname: string) => {
  const response = await trainingApiClient.get(`/user/${nickname}`)
  return response.data.data
}
