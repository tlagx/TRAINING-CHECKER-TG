import { fetchPlayersOnline } from '../services/PlayersService.js';
import { getUserLanguage, t } from '../utils/language.js';
import { Markup } from 'telegraf';
export const onlinePlayersHandler = async (ctx, updateMessage = false) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    try {
        const players = await fetchPlayersOnline();
        // Check if players data exists
        if (!players) {
            const message = t(userLang, 'common', 'no_data_found');
            const backKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
            ]);
            if (updateMessage) {
                return ctx.editMessageText(message, backKeyboard);
            }
            else {
                return ctx.reply(message, backKeyboard);
            }
        }
        // Handle different response structures
        let playersArray = players;
        if (Array.isArray(players)) {
            // Already an array
        }
        else if (players.data && Array.isArray(players.data)) {
            // Extract array from data property
            playersArray = players.data;
        }
        else if (players.players && Array.isArray(players.players)) {
            // Extract array from players property
            playersArray = players.players;
        }
        else {
            // Convert to array if it's a single object or other structure
            playersArray = [players];
        }
        // Format and send online players list
        const playerCount = playersArray.length;
        // Format and send online players list without commands
        const playerList = playersArray.map((p) => {
            const login = p.login || p.name || p.username || 'Unknown';
            const playerid = p.playerid || p.id || 'N/A';
            return `${login} (${playerid})`;
        }).join('\n');
        const title = t(userLang, 'common', 'online_players_title');
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        if (updateMessage) {
            ctx.editMessageText(`${title} (${playerCount})\n\n${playerList}`, backKeyboard);
        }
        else {
            ctx.reply(`${title} (${playerCount})\n\n${playerList}`, backKeyboard);
        }
    }
    catch (error) {
        const message = t(userLang, 'common', 'error_fetching_data') + `: ${error.message}`;
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        if (updateMessage) {
            ctx.editMessageText(message, backKeyboard);
        }
        else {
            ctx.reply(message, backKeyboard);
        }
    }
};
//# sourceMappingURL=onlinePlayers.js.map