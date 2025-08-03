import { Telegraf } from 'telegraf'
import { playerInfoHandler } from './handlers/playerInfo'
import { onlinePlayersHandler } from './handlers/onlinePlayers'
import { worldListHandler } from './handlers/worldList'
import { copchaseHandler } from './handlers/copchase'
import { adminListHandler } from './handlers/adminList'

const BOT_TOKEN = process.env.BOT_TOKEN

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required')
}

const bot = new Telegraf(BOT_TOKEN)

// Command handlers
bot.command('start', (ctx) => {
  ctx.reply('Welcome to the Training Checker Telegram bot! Use /help to see available commands')
})

bot.command('help', (ctx) => {
  ctx.reply('Available commands:\n' +
    '/playerinfo [nickname] - Get player information\n' +
    '/online - Get list of online players\n' +
    '/worlds - Get world list\n' +
    '/copchase - Get copchase lobbies\n' +
    '/admins - Get admin list')
})

// Player info command
bot.command('playerinfo', playerInfoHandler)

// Online players command
bot.command('online', onlinePlayersHandler)

// World list command
bot.command('worlds', worldListHandler)

// Copchase command
bot.command('copchase', copchaseHandler)

// Admin list command
bot.command('admins', adminListHandler)

bot.launch()
console.log('Telegram bot started')
