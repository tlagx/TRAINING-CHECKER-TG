import { Context } from 'telegraf'
import { AdminList } from '../services/AdminService'

export const adminListHandler = async (ctx: Context) => {
  try {
    const admins = await AdminList()
    // Format and send admin list
    ctx.replyWithMarkdownV2(`*Admin List (${admins.length})*\n\n` +
      admins.map((a: any) => `${a.login} (${a.id}) - ${a.warn} warns`).join('\n'))
  } catch (error: any) {
    ctx.reply(`Error fetching admin list: ${error.message}`)
  }
}
