import { Context } from 'telegraf'
import { getWorlds } from '../services/WorldsService'

export const worldListHandler = async (ctx: Context) => {
  try {
    const worldsData = await getWorlds()
    // Format and send world list
    ctx.replyWithMarkdownV2(`*World List (${worldsData.worlds.length} worlds)*\n\n` +
      worldsData.worlds.map((w: any) => `${w.name} - ${w.players} players`).join('\n'))
  } catch (error: any) {
    ctx.reply(`Error fetching world list: ${error.message}`)
  }
}
