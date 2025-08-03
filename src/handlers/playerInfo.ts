import { Context } from 'telegraf'
import { getPlayer } from '../services/PlayerService'

export const playerInfoHandler = async (ctx: Context) => {
  const args = ctx.match?.input.split(' ')
  if (!args || args.length < 2) {
    return ctx.reply('Please provide a nickname: /playerinfo [nickname]')
  }

  const nickname = args[1]
  try {
    const playerData = await getPlayer(nickname)
    // Format and send player info
    ctx.replyWithMarkdownV2(`*Player Info for ${playerData.login}*\n\n` +
      `ID: ${playerData.id}\n` +
      `Verify: ${playerData.verify}\n` +
      `Moder: ${playerData.moder}\n` +
      `Register date: ${playerData.regdate}`)
  } catch (error: any) {
    ctx.reply(`Error fetching player info: ${error.message}`)
  }
}
