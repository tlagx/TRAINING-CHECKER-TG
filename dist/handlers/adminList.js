import { AdminList } from '../services/AdminService.js';
import { getUserLanguage, t } from '../utils/language.js';
import { Markup } from 'telegraf';
export const adminListHandler = async (ctx, updateMessage = false) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    try {
        const admins = await AdminList();
        // Check if admins data exists
        if (!admins) {
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
        let adminsArray = admins;
        if (Array.isArray(admins)) {
            // Already an array
        }
        else if (admins.data && Array.isArray(admins.data)) {
            // Extract array from data property
            adminsArray = admins.data;
        }
        else if (admins.admins && Array.isArray(admins.admins)) {
            // Extract array from admins property
            adminsArray = admins.admins;
        }
        else {
            // Convert to array if it's a single object or other structure
            adminsArray = [admins];
        }
        // Format and send admin list
        const adminCount = adminsArray.length;
        // Format and send admin list
        const adminList = adminsArray.map((a) => {
            const login = a.login || a.name || a.username || 'Unknown';
            const id = a.id || a.playerid || 'N/A';
            const warns = a.warn || a.warns || 0;
            return `${login} (${id}) - ${warns} warns`;
        }).join('\n');
        const title = t(userLang, 'common', 'admins_title');
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        if (updateMessage) {
            ctx.editMessageText(`${title} (${adminCount})\n\n${adminList}`, backKeyboard);
        }
        else {
            ctx.reply(`${title} (${adminCount})\n\n${adminList}`, backKeyboard);
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
//# sourceMappingURL=adminList.js.map