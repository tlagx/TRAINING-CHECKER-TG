import dotenv from 'dotenv';
dotenv.config();
import { Telegraf, session } from 'telegraf';
import { playerInfoHandler, handleWarnsButton } from './handlers/playerInfo.js';
import { onlinePlayersHandler } from './handlers/onlinePlayers.js';
import { worldListHandler } from './handlers/worldList.js';
import { copchaseHandler } from './handlers/copchase.js';
import { adminListHandler } from './handlers/adminList.js';
import { badgesHandler } from './handlers/badges.js';
import { languageHandler, handleLanguageSelection, getLocalizedCommand } from './handlers/language.js';
import { mainMenuHandler, handleMenuSelection, handleNicknameInput } from './handlers/menu.js';
import { getUserLanguage } from './utils/language.js';
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is required');
}
const bot = new Telegraf(BOT_TOKEN);
// Session middleware to store user data
bot.use(session());
// Command handlers
bot.command('start', async (ctx) => {
    var _a;
    // Check if user has selected language
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    if (!userLang) {
        // First time user, ask for language preference
        return languageHandler(ctx);
    }
    // Show main menu
    await mainMenuHandler(ctx);
});
bot.command('help', async (ctx) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    const message = getLocalizedCommand('help', userLang);
    ctx.reply(message);
});
// Player info command
bot.command('playerinfo', (ctx) => playerInfoHandler(ctx, false));
// Online players command
bot.command('online', (ctx) => onlinePlayersHandler(ctx, false));
// World list command
bot.command('worlds', (ctx) => worldListHandler(ctx, false));
// Copchase command
bot.command('copchase', (ctx) => copchaseHandler(ctx, false));
// Admin list command
bot.command('admins', (ctx) => adminListHandler(ctx, false));
// Badges command
bot.command('badges', (ctx) => badgesHandler(ctx, false));
// Language command
bot.command('language', languageHandler);
// Menu command
bot.command('menu', mainMenuHandler);
// Handle text messages (for nickname input)
bot.on('text', async (ctx) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    // Check if we're waiting for a nickname input
    // This would be handled in the menu handler
    await handleNicknameInput(ctx);
});
// Handle callback queries (inline button clicks)
bot.on('callback_query', async (ctx) => {
    if ('data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;
        // Handle language selection
        if (data.startsWith('lang_')) {
            const langCode = data.split('_')[1];
            return handleLanguageSelection(ctx, langCode);
        }
        // Handle menu selections
        if (data.startsWith('menu_')) {
            return handleMenuSelection(ctx, data);
        }
        // Handle warns button
        if (data.startsWith('warns_')) {
            const nickname = data.split('_')[1];
            return handleWarnsButton(ctx, nickname);
        }
    }
    // Answer the callback query to remove the loading state
    return ctx.answerCbQuery();
});
bot.launch();
console.log('Telegram bot started');
//# sourceMappingURL=index.js.map