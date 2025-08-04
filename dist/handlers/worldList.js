import { getWorlds } from '../services/WorldsService.js';
import { getUserLanguage, t } from '../utils/language.js';
import { Markup } from 'telegraf';
export const worldListHandler = async (ctx, updateMessage = false) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    try {
        const worldsData = await getWorlds();
        // Check if worldsData exists
        if (!worldsData) {
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
        let worldsArray = worldsData;
        if (worldsData.worlds && Array.isArray(worldsData.worlds)) {
            // Extract array from worlds property
            worldsArray = worldsData.worlds;
        }
        else if (Array.isArray(worldsData)) {
            // Already an array
        }
        else if (worldsData.data && Array.isArray(worldsData.data)) {
            // Extract array from data property
            worldsArray = worldsData.data;
        }
        else {
            // Convert to array if it's a single object or other structure
            worldsArray = [worldsData];
        }
        // Format and send world list
        const worldCount = worldsArray.length;
        const worldList = worldsArray.map((w) => {
            const name = w.name || w.worldName || 'Unknown';
            // Remove color codes like {000000} from world names
            const cleanName = name.replace(/\{[0-9A-Fa-f]{6}\}/g, '');
            const players = w.players || w.playerCount || 0;
            return `${cleanName} - ${players} players`;
        }).join('\n');
        const title = t(userLang, 'common', 'worlds_title');
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        if (updateMessage) {
            ctx.editMessageText(`${title} (${worldCount} worlds)\n\n${worldList || 'No worlds found'}`, backKeyboard);
        }
        else {
            ctx.reply(`${title} (${worldCount} worlds)\n\n${worldList || 'No worlds found'}`, backKeyboard);
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
//# sourceMappingURL=worldList.js.map