import { loadTranslations, getUserLanguage, t } from '../utils/language.js'
import { Markup } from 'telegraf'

// Define badge data with emojis
export const badgeData = [
  {
    id: 1,
    translationKey: "creator",
    category: "staff",
    icon: "👑",
  },
  {
    id: 2,
    translationKey: "admin",
    category: "staff",
    icon: "🛡️",
  },
  {
    id: 3,
    translationKey: "team",
    category: "staff",
    icon: "👥",
  },
  {
    id: 4,
    translationKey: "site",
    category: "staff",
    icon: "💻",
  },
  {
    id: 5,
    translationKey: "veteran",
    category: "player",
    icon: "🎖️",
  },
  {
    id: 6,
    translationKey: "youtuber",
    category: "player",
    icon: "📺",
  },
  {
    id: 7,
    translationKey: "exteam",
    category: "player",
    icon: "👋",
  },
  {
    id: 8,
    translationKey: "bot",
    category: "player",
    icon: "🤖",
  },
  {
    id: 9,
    translationKey: "chronos",
    category: "player",
    icon: "⏰",
  },
]

export const badgesHandler = async (ctx: any, updateMessage: boolean = false) => {
  // Get user language
  const userId = ctx.from?.id.toString() || 'default'
  const langCode = await getUserLanguage(userId)
  
  // Load badge translations
  const badgeTranslations = loadTranslations(langCode, 'badges')
  
  if (!badgeTranslations || !badgeTranslations.items) {
    const message = t(langCode, 'common', 'error_fetching_data')
    const backKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback(t(langCode, 'common', 'menu_back'), 'menu_main')]
    ])
    if (updateMessage) {
      return ctx.editMessageText(message, backKeyboard)
    } else {
      return ctx.reply(message, backKeyboard)
    }
  }
  
  // Create badge list message
  let message = `*${badgeTranslations.title}*\n\n`
  
  // Group badges by category
  const staffBadges = badgeData.filter(badge => badge.category === 'staff')
  const playerBadges = badgeData.filter(badge => badge.category === 'player')
  
  // Add staff badges
  const staffBadgesTitle = t(langCode, 'badges', 'staff_badges_title') || 'Staff Badges:'
  message += `*${staffBadgesTitle}*\n`
  for (const badge of staffBadges) {
    const translation = badgeTranslations.items[badge.translationKey]
    if (translation) {
      message += `${badge.icon} *${translation.title}*\n`
      message += `_${translation.description}_\n\n`
    }
  }
  
  // Add player badges
  const playerBadgesTitle = t(langCode, 'badges', 'player_badges_title') || 'Player Badges:'
  message += `*${playerBadgesTitle}*\n`
  for (const badge of playerBadges) {
    const translation = badgeTranslations.items[badge.translationKey]
    if (translation) {
      message += `${badge.icon} *${translation.title}*\n`
      message += `_${translation.description}_\n\n`
    }
  }
  
  const backKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(t(langCode, 'common', 'menu_back'), 'menu_main')]
  ])
  
  if (updateMessage) {
    await ctx.editMessageText(message, { parse_mode: 'Markdown', ...backKeyboard })
  } else {
    await ctx.reply(message, { parse_mode: 'Markdown', ...backKeyboard })
  }
}
