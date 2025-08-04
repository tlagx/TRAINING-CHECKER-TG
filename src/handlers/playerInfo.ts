import { getPlayer, getAdditionalInfo } from '../services/PlayerService.js'
import { getVerifyRole, getModerRole } from '../services/PlayerService.js'
import { getUserLanguage, t, loadTranslations } from '../utils/language.js'
import { badgeData } from './badges.js'
import { Markup } from 'telegraf'

// Define badge type
type Badge = {
  id: number;
  translationKey: string;
  category: string;
  icon: string;
  criteria?: (playerData: any, additionalInfo: any) => boolean;
};

// Function to remove color codes from text
const removeColorCodes = (text: string): string => {
  return text.replace(/\{[0-9A-Fa-f]{6}\}/g, '')
}

// Add criteria functions to badge data
const badgeDataWithCriteria: Badge[] = badgeData.map((badge: Badge) => {
  let criteriaFunction: (playerData: any, additionalInfo: any) => boolean;
  
  switch (badge.translationKey) {
    case "creator":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.id === 1 || playerData.id === 2;
      break;
    case "admin":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.moder === 999;
      break;
    case "team":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.moder > 0;
      break;
    case "site":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.id === 125043 || playerData.id === 113145;
      break;
    case "veteran":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.id < 130000;
      break;
    case "youtuber":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.verify === 5;
      break;
    case "exteam":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.verify === 4;
      break;
    case "bot":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.moder === 997 || playerData.verify === 6;
      break;
    case "chronos":
      criteriaFunction = (playerData: any, additionalInfo: any) => playerData.id === 644835;
      break;
    default:
      criteriaFunction = (playerData: any, additionalInfo: any) => false;
  }
  
  return {
    ...badge,
    criteria: criteriaFunction
  };
});

export const playerInfoHandler = async (ctx: any, updateMessage: boolean = false) => {
  const userId = ctx.from?.id.toString() || 'default'
  const userLang = await getUserLanguage(userId)
  
  // Extract the nickname from the command arguments
  const text = ctx.message && 'text' in ctx.message ? ctx.message.text : ''
  const args = text.split(' ')
  
  if (args.length < 2) {
    const message = t(userLang, 'common', 'player_info_missing_nickname')
    const backKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
    ])
    if (updateMessage) {
      return ctx.editMessageText(message, backKeyboard)
    } else {
      return ctx.reply(message, backKeyboard)
    }
  }

  const nickname = args[1]
  try {
    const playerData = await getPlayer(nickname)
    
    // Check if playerData exists
    if (!playerData) {
      const message = t(userLang, 'common', 'player_info_not_found', { nickname })
      const backKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
      ])
      if (updateMessage) {
        return ctx.editMessageText(message, backKeyboard)
      } else {
        return ctx.reply(message, backKeyboard)
      }
    }
    
    // Get additional info
    const additionalInfo = await getAdditionalInfo(nickname)
    
    // Format and send player info
    const login = playerData.login || 'Unknown'
    const id = playerData.id || 'N/A'
    const verify = playerData.verify !== undefined ? getVerifyRole(playerData.verify, userLang) : null
    const moder = playerData.moder !== undefined ? getModerRole(playerData.moder, userLang) : 'N/A'
    let regdate = playerData.regdate || 'N/A'
    const verifyText = playerData.verifyText ? removeColorCodes(playerData.verifyText) : null
    const lastlogin = playerData.lastlogin || null
    const warn = playerData.warn || []
    
    // Special handling for registration date
    if (regdate === '1970-01-01 03:00:00') {
      regdate = t(userLang, 'common', 'trainingchecker/playerinfo.info.registerDateBefore2018')
    }
    
    // Format message according to the requested structure
    let message = `${t(userLang, 'common', 'player_info_title')} ${login} (№${id})\n\n`
    
    // Add verification only if it exists
    if (verify) {
      message += `${t(userLang, 'common', 'player_info_verify')}: ${verify}\n`
      
      // Add verifyText if available and not empty
      if (verifyText) {
        message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.verifyText')}: ${verifyText}\n\n`
      } else {
        message += '\n'
      }
    }
    
    message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.status')}: ${moder}\n` +
      `${t(userLang, 'common', 'player_info_regdate')}: ${regdate}\n`
    
    // Add lastlogin if available
    if (lastlogin) {
      message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.lastConnect')}: ${lastlogin}\n`
    }
    
    // Add additional info if available
    if (additionalInfo) {
      const additionalTitle = t(userLang, 'common', 'trainingchecker/additionalinfo.title')
      const bonusPointsLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.bonus_points')
      const socialCreditsLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.social_credits')
      const copchaseRatingLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.copchase_rate')
      const prefixLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.prefix')
      const achievementLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.achievement')
      
      message += `\n${additionalTitle}:\n`
      
      if (additionalInfo.bonus_points !== undefined) {
        message += `${bonusPointsLabel}: ${additionalInfo.bonus_points}\n`
      }
      
      if (additionalInfo.social_credits !== undefined) {
        message += `${socialCreditsLabel}: ${additionalInfo.social_credits}\n`
      }
      
      if (additionalInfo.cop_chase_rating !== undefined) {
        message += `${copchaseRatingLabel}: ${additionalInfo.cop_chase_rating}\n`
      }
      
      // Remove color codes from prefix and achievement
      if (additionalInfo.prefix) {
        message += `${prefixLabel}: ${removeColorCodes(additionalInfo.prefix)}\n`
      }
      
      if (additionalInfo.achievement) {
        message += `${achievementLabel}: ${removeColorCodes(additionalInfo.achievement)}\n`
      }
    }
    
    // Add achievements section
    const badgeTranslations = loadTranslations(userLang, 'badges')
    if (badgeTranslations && badgeTranslations.items) {
      const earnedBadges = badgeDataWithCriteria.filter((badge: Badge) => badge.criteria && badge.criteria(playerData, additionalInfo))
      
      if (earnedBadges.length > 0) {
        message += `\n${t(userLang, 'common', 'badges_title')}:\n`
        for (const badge of earnedBadges) {
          const translation = badgeTranslations.items[badge.translationKey]
          if (translation) {
            message += `${badge.icon} ${translation.title}\n`
            message += `${translation.description}\n\n`
          }
        }
      }
    }
    
    // Add warns if available (always show when they exist)
    if (warn.length > 0) {
      message += `${t(userLang, 'common', 'trainingchecker/playerinfo.button.punishments')} (${warn.length}):\n\n`
      
      // Limit the number of warns to show to avoid message too long error
      const maxWarnsToShow = 50
      const warnsToShow = warn.slice(0, maxWarnsToShow)
      
      for (const w of warnsToShow) {
        const reason = w.reason || 'N/A'
        const admin = w.admin || 'N/A'
        const bantime = w.bantime || 'N/A'
        message += `• ${reason} (${admin}) - ${bantime}\n`
      }
      
      // Add note if there are more warns than shown
      if (warn.length > maxWarnsToShow) {
        message += `\n... and ${warn.length - maxWarnsToShow} more`
      }
    }
    
    const backKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
    ])
    
    if (updateMessage) {
      await ctx.editMessageText(message, backKeyboard)
    } else {
      await ctx.reply(message, backKeyboard)
    }
  } catch (error: any) {
    const message = t(userLang, 'common', 'player_info_error', { error: error.message })
    const backKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
    ])
    
    if (updateMessage) {
      ctx.editMessageText(message, backKeyboard)
    } else {
      ctx.reply(message, backKeyboard)
    }
  }
}

// Empty handler for warns button (no longer used)
export const handleWarnsButton = async (ctx: any, nickname: string) => {
  // This function is no longer used since warns are always shown
  ctx.answerCbQuery()
}
