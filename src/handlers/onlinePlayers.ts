import { Context } from 'telegraf'
import { fetchPlayersOnline } from '../services/PlayersService'

export const onlinePlayersHandler = async (ctx: Context) => {
  try {
    const players = await fetchPlayersOnline()
    // Format and send online players list
    ctx.replyWithMarkdownV2(`*Online Players (${players.length})*\n\n` + 
      players.map((p: any) => `${p.login} (${p.playerid})`).join('\n'))
  } catch (error: any) {
    ctx.reply(`Error fetching online players: ${error.message}`)
  }
}
