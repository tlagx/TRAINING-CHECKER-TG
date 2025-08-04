import { fetchCopchaseLobbies } from '../services/CopchaseService.js';
import { getUserLanguage, t } from '../utils/language.js';
import { Markup } from 'telegraf';
export const copchaseHandler = async (ctx, updateMessage = false) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    try {
        const copchaseData = await fetchCopchaseLobbies();
        // Check if copchaseData exists
        if (!copchaseData) {
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
        let lobbiesArray = copchaseData;
        if (copchaseData.lobbies && Array.isArray(copchaseData.lobbies)) {
            // Extract array from lobbies property
            lobbiesArray = copchaseData.lobbies;
        }
        else if (Array.isArray(copchaseData)) {
            // Already an array
        }
        else if (copchaseData.data && Array.isArray(copchaseData.data)) {
            // Extract array from data property
            lobbiesArray = copchaseData.data;
        }
        else {
            // Convert to array if it's a single object or other structure
            lobbiesArray = [copchaseData];
        }
        // Format and send copchase info
        const lobbyCount = lobbiesArray.length;
        // Format lobby information as requested
        const lobbyList = lobbiesArray.map((l) => {
            const number = l.number || l.id || 'Unknown';
            const status = l.status || 'Unknown';
            const time = l.time || '00:00';
            const players = l.players || 0;
            const maxPlayers = l.max_players || 8;
            // Translate status
            let statusText = status;
            if (status === 'Подбор') {
                statusText = t(userLang, 'common', 'copchase_status_search') || 'Подбор';
            }
            else if (status === 'В игре') {
                statusText = t(userLang, 'common', 'copchase_status_ingame') || 'В игре';
            }
            else if (status === '') {
                statusText = t(userLang, 'common', 'copchase_status_empty') || '-';
            }
            return `${t(userLang, 'common', 'copchase_lobby')} №${number}\n${t(userLang, 'common', 'copchase_status')}: ${statusText}\n${t(userLang, 'common', 'copchase_time')}: ${time}\n${t(userLang, 'common', 'copchase_players')}: ${players}/${maxPlayers}\n`;
        }).join('\n');
        const title = t(userLang, 'common', 'copchase_title');
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        if (updateMessage) {
            ctx.editMessageText(`${title} (${lobbyCount})\n\n${lobbyList}`, backKeyboard);
        }
        else {
            ctx.reply(`${title} (${lobbyCount})\n\n${lobbyList}`, backKeyboard);
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
//# sourceMappingURL=copchase.js.map