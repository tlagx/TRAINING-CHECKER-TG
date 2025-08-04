import { trainingApiClient, chronoApiClient } from '../api/axios.js'
import { getTranslation } from '../utils/language.js'

// Key maps for verify and moder roles
export const getVerifyRole = (verifyKey: number, langCode: string = 'en'): string => {
  const keyMap = {
    1: 'trainingchecker/playerinfo.verify.youtuber',
    2: 'trainingchecker/playerinfo.verify.community_author',
    3: 'trainingchecker/playerinfo.verify.developer',
    4: 'trainingchecker/playerinfo.verify.retired_admin',
    5: 'trainingchecker/playerinfo.verify.sponsor',
    6: 'trainingchecker/playerinfo.verify.world_creator',
    7: 'trainingchecker/playerinfo.verify.unknown'
  } as const;
  
  const translationKey = keyMap[verifyKey as keyof typeof keyMap];
  if (translationKey) {
    return getTranslation(langCode, 'common', translationKey);
  }
  return getTranslation(langCode, 'common', 'trainingchecker/playerinfo.verify.unknown');
}

export const getModerRole = (moderKey: number, langCode: string = 'en'): string => {
  const keyMap = {
    0: 'trainingchecker/playerinfo.moderator.player',
    1: 'trainingchecker/playerinfo.moderator.junior',
    2: 'trainingchecker/playerinfo.moderator.regular',
    3: 'trainingchecker/playerinfo.moderator.senior',
    997: 'trainingchecker/playerinfo.moderator.bot',
    999: 'trainingchecker/playerinfo.moderator.admin'
  } as const;
  
  const translationKey = keyMap[moderKey as keyof typeof keyMap];
  if (translationKey) {
    return getTranslation(langCode, 'common', translationKey);
  }
  return getTranslation(langCode, 'common', 'trainingchecker/playerinfo.moderator.player');
}

export const getPlayer = async (nickname: string) => {
  const response: any = await trainingApiClient.get(`/api/user/${nickname}`)
  // Handle different response structures
  if (response.data && response.data.data) {
    return response.data.data
  }
  return response.data || response
}

export const getAdditionalInfo = async (nickname: string) => {
  try {
    const response: any = await chronoApiClient.get(`/api/user?nickname=${nickname}`)
    return response.data || response
  } catch (error) {
    console.error('Error fetching additional info:', error)
    return null
  }
}
