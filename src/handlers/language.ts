import { setUserLanguage, getUserLanguage, loadTranslations, t } from '../utils/language.js'
import { Markup } from 'telegraf'

export const languageHandler = async (ctx: any) => {
  const userId = ctx.from?.id.toString() || 'default'
  const userLang = await getUserLanguage(userId)
  
  const message = t(userLang || 'en', 'common', 'language_select')
  
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('English 🇬🇧', 'lang_en')],
    [Markup.button.callback('Русский 🇷🇺', 'lang_ru')],
    [Markup.button.callback(t(userLang || 'en', 'common', 'menu_back'), 'menu_main')]
  ])
  
  await ctx.editMessageText(message, keyboard)
}

export const handleLanguageSelection = async (ctx: any, langCode: string) => {
  if (ctx.from?.id) {
    await setUserLanguage(ctx.from.id.toString(), langCode)
    
    // Send notification about language change
    const notificationMessage = t(langCode, 'common', 'language_set')
    const notificationWithInfo = notificationMessage + '\n\n' + 
      (langCode === 'ru' 
        ? 'Вы вернетесь в меню через 5 секунд...' 
        : 'You will return to the menu in 5 seconds...')
    
    await ctx.editMessageText(notificationWithInfo)
    await ctx.answerCbQuery()
    
    // Return to main menu after 5 seconds
    setTimeout(async () => {
      try {
        // Try to edit the message to return to main menu
        await ctx.editMessageText('Returning to main menu...')
        // Actually return to main menu
        const userId = ctx.from?.id.toString() || 'default'
        const userLang = await getUserLanguage(userId)
        const message = t(userLang, 'common', 'welcome')
        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback(t(userLang, 'common', 'menu_player_info'), 'menu_player_info'),
            Markup.button.callback(t(userLang, 'common', 'menu_online_players'), 'menu_online_players')
          ],
          [
            Markup.button.callback(t(userLang, 'common', 'menu_worlds'), 'menu_worlds'),
            Markup.button.callback(t(userLang, 'common', 'menu_copchase'), 'menu_copchase')
          ],
          [
            Markup.button.callback(t(userLang, 'common', 'menu_admins'), 'menu_admins'),
            Markup.button.callback(t(userLang, 'common', 'menu_badges'), 'menu_badges')
          ],
          [
            Markup.button.callback(t(userLang, 'common', 'menu_language'), 'menu_language')
          ]
        ])
        await ctx.editMessageText(message, keyboard)
      } catch (error) {
        console.error('Error returning to main menu:', error)
      }
    }, 5000)
  }
}

export const getLocalizedMessage = (langCode: string, key: string, params: Record<string, string> = {}) => {
  return t(langCode, 'common', key, params)
}

export const getLocalizedCommand = (command: string, langCode: string, params: Record<string, string> = {}) => {
  return t(langCode, 'common', command, params)
}
