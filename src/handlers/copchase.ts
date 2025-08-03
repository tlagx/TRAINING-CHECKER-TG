import { Context } from 'telegraf'
import { fetchCopchaseLobbies } from '../services/CopchaseService'

export const copchaseHandler = async (ctx: Context) => {
  try {
    const lobbies = await fetchCopchaseLobbies()
    // Format and send copchase info
    ctx.replyWithMarkdownV2(`*Copchase Lobbies (${lobbies.lobbies.length})*\n\n` +
      lobbies.lobbies.map((l: any) => `${l.number}: ${l.status} (${l.players} players)`).join('\n'))
  } catch (error: any) {
    ctx.reply(`Error fetching copchase data: ${error.message}`)
  }
}
