import { getUserLanguage, t } from '../utils/language.js';
import { Markup } from 'telegraf';
import { onlinePlayersHandler } from './onlinePlayers.js';
import { worldListHandler } from './worldList.js';
import { copchaseHandler } from './copchase.js';
import { adminListHandler } from './adminList.js';
import { badgesHandler } from './badges.js';
import { getPlayer, getAdditionalInfo } from '../services/PlayerService.js';
import { getVerifyRole, getModerRole } from '../services/PlayerService.js';
import { loadTranslations } from '../utils/language.js';
// Store user states for nickname input
const userStates = {};
// Function to remove color codes from text
const removeColorCodes = (text) => {
    return text.replace(/\{[0-9A-Fa-f]{6}\}/g, '');
};
export const mainMenuHandler = async (ctx) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    // Reset user state
    userStates[userId] = { waitingForNickname: false };
    const message = t(userLang, 'common', 'welcome');
    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback(t(userLang, 'common', 'menu_player_info'), 'menu_player_info'),
            Markup.button.callback(t(userLang, 'common', 'menu_online_players'), 'menu_online_players')
        ],
        [
            Markup.button.callback(t(userLang, 'common', 'menu_worlds'), 'menu_worlds'),
            Markup.button.callback(t(userLang, 'common', 'menu_copchase'), 'menu_copchase')
        ],
        [
            Markup.button.callback(t(userLang, 'common', 'menu_admins'), 'menu_admins'),
            Markup.button.callback(t(userLang, 'common', 'menu_badges'), 'menu_badges')
        ],
        [
            Markup.button.callback(t(userLang, 'common', 'menu_language'), 'menu_language')
        ]
    ]);
    // Edit message if it's a callback query, otherwise send new message
    if (ctx.callbackQuery) {
        try {
            await ctx.editMessageText(message, keyboard);
        }
        catch (error) {
            // If editing fails, send a new message instead
            const sentMessage = await ctx.reply(message, keyboard);
            // Store message ID for potential future use
            if (!userStates[userId]) {
                userStates[userId] = { waitingForNickname: false };
            }
            userStates[userId].previousMessageId = sentMessage.message_id;
        }
    }
    else {
        const sentMessage = await ctx.reply(message, keyboard);
        // Store message ID for potential future use
        if (!userStates[userId]) {
            userStates[userId] = { waitingForNickname: false };
        }
        userStates[userId].previousMessageId = sentMessage.message_id;
    }
};
export const handleMenuSelection = async (ctx, action) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userLang = await getUserLanguage(userId);
    switch (action) {
        case 'menu_player_info':
            // Ask for nickname
            const nicknamePrompt = t(userLang, 'common', 'player_info_missing_nickname');
            const backKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
            ]);
            try {
                await ctx.editMessageText(nicknamePrompt, backKeyboard);
                // Store message ID for potential future use when editing succeeds
                if (ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.message_id) {
                    if (!userStates[userId]) {
                        userStates[userId] = { waitingForNickname: true };
                    }
                    else {
                        userStates[userId].waitingForNickname = true;
                    }
                    userStates[userId].previousMessageId = ctx.callbackQuery.message.message_id;
                }
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(nicknamePrompt, backKeyboard);
                // Store message ID for potential future use
                if (!userStates[userId]) {
                    userStates[userId] = { waitingForNickname: true };
                }
                else {
                    userStates[userId].waitingForNickname = true;
                }
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            break;
        case 'menu_online_players':
            // Show loading message
            const loadingMessage1 = t(userLang, 'common', 'loading');
            try {
                await ctx.editMessageText(loadingMessage1);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(loadingMessage1);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            // Show online players and update the same message
            await onlinePlayersHandler(ctx, true); // Pass flag to indicate we're updating the same message
            break;
        case 'menu_worlds':
            // Show loading message
            const loadingMessage2 = t(userLang, 'common', 'loading');
            try {
                await ctx.editMessageText(loadingMessage2);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(loadingMessage2);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            // Show worlds and update the same message
            await worldListHandler(ctx, true); // Pass flag to indicate we're updating the same message
            break;
        case 'menu_copchase':
            // Show loading message
            const loadingMessage3 = t(userLang, 'common', 'loading');
            try {
                await ctx.editMessageText(loadingMessage3);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(loadingMessage3);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            // Show copchase lobbies and update the same message
            await copchaseHandler(ctx, true); // Pass flag to indicate we're updating the same message
            break;
        case 'menu_admins':
            // Show loading message
            const loadingMessage4 = t(userLang, 'common', 'loading');
            try {
                await ctx.editMessageText(loadingMessage4);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(loadingMessage4);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            // Show admins and update the same message
            await adminListHandler(ctx, true); // Pass flag to indicate we're updating the same message
            break;
        case 'menu_badges':
            // Show loading message
            const loadingMessage5 = t(userLang, 'common', 'loading');
            try {
                await ctx.editMessageText(loadingMessage5);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(loadingMessage5);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            // Show badges and update the same message
            await badgesHandler(ctx, true); // Pass flag to indicate we're updating the same message
            break;
        case 'menu_language':
            // Show language selection
            const languageMessage = t(userLang, 'common', 'language_select');
            const languageKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('English 🇬🇧', 'lang_en')],
                [Markup.button.callback('Русский 🇷🇺', 'lang_ru')],
                [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
            ]);
            try {
                await ctx.editMessageText(languageMessage, languageKeyboard);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(languageMessage, languageKeyboard);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
            }
            break;
        case 'menu_main':
            // Return to main menu and delete previous message if exists
            if (userStates[userId] && userStates[userId].previousMessageId) {
                try {
                    await ctx.telegram.deleteMessage(ctx.chat.id, userStates[userId].previousMessageId);
                }
                catch (error) {
                    // Ignore if we can't delete the message
                }
            }
            await mainMenuHandler(ctx);
            break;
        default:
            // Handle unknown actions
            const unknownActionMessage = t(userLang, 'common', 'error_unknown_action');
            await ctx.answerCbQuery(unknownActionMessage);
    }
};
export const handleNicknameInput = async (ctx) => {
    var _a;
    const userId = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'default';
    const userState = userStates[userId];
    if (!userState || !userState.waitingForNickname) {
        return;
    }
    // Delete user's message
    try {
        await ctx.deleteMessage();
    }
    catch (error) {
        // Ignore if we can't delete the message
    }
    // Delete the "Please provide a nickname:" prompt message if it exists
    if (userState.previousMessageId) {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, userState.previousMessageId);
        }
        catch (error) {
            // Ignore if we can't delete the message
        }
    }
    // Extract nickname from message
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    if (!text) {
        return;
    }
    // Get user language first before any possible return
    const userLang = await getUserLanguage(userId);
    // Check for Cyrillic characters and reject if found
    if (/[а-яА-ЯёЁ]/.test(text)) {
        const errorMessage = t(userLang, 'common', 'player_info_cyrillic_not_allowed');
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        try {
            await ctx.editMessageText(errorMessage, backKeyboard);
        }
        catch (error) {
            // If editing fails, send a new message instead
            await ctx.reply(errorMessage, backKeyboard);
        }
        return;
    }
    // Get player info directly instead of calling playerInfoHandler
    const nickname = text;
    try {
        const playerData = await getPlayer(nickname);
        // Check if playerData exists
        if (!playerData) {
            const message = t(userLang, 'common', 'player_info_not_found', { nickname });
            const backKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
            ]);
            try {
                return ctx.editMessageText(message, backKeyboard);
            }
            catch (error) {
                // If editing fails, send a new message instead
                const sentMessage = await ctx.reply(message, backKeyboard);
                // Store message ID for potential future use
                userStates[userId].previousMessageId = sentMessage.message_id;
                return;
            }
        }
        // Get additional info
        const additionalInfo = await getAdditionalInfo(nickname);
        // Format and send player info
        const login = playerData.login || 'Unknown';
        const id = playerData.id || 'N/A';
        const verify = playerData.verify !== undefined ? getVerifyRole(playerData.verify, userLang) : null;
        const moder = playerData.moder !== undefined ? getModerRole(playerData.moder, userLang) : 'N/A';
        let regdate = playerData.regdate || 'N/A';
        const verifyText = playerData.verifyText ? removeColorCodes(playerData.verifyText) : null;
        const lastlogin = playerData.lastlogin || null;
        const warn = playerData.warn || [];
        // Special handling for registration date
        if (regdate === '1970-01-01 03:00:00') {
            regdate = t(userLang, 'common', 'trainingchecker/playerinfo.info.registerDateBefore2018');
        }
        // Format message according to the requested structure
        let message = `${t(userLang, 'common', 'player_info_title')} ${login} (№${id})\n\n`;
        // Add verification only if it exists
        if (verify) {
            message += `${t(userLang, 'common', 'player_info_verify')}: ${verify}\n`;
            // Add verifyText if available and not empty
            if (verifyText) {
                message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.verifyText')}: ${verifyText}\n\n`;
            }
            else {
                message += '\n';
            }
        }
        message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.status')}: ${moder}\n` +
            `${t(userLang, 'common', 'player_info_regdate')}: ${regdate}\n`;
        // Add lastlogin if available
        if (lastlogin) {
            message += `${t(userLang, 'common', 'trainingchecker/playerinfo.info.lastConnect')}: ${lastlogin}\n`;
        }
        // Add additional info if available
        if (additionalInfo) {
            const additionalTitle = t(userLang, 'common', 'trainingchecker/additionalinfo.title');
            const bonusPointsLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.bonus_points');
            const socialCreditsLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.social_credits');
            const copchaseRatingLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.copchase_rate');
            const prefixLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.prefix');
            const achievementLabel = t(userLang, 'common', 'trainingchecker/additionalinfo.achievement');
            message += `\n${additionalTitle}:\n`;
            if (additionalInfo.bonus_points !== undefined) {
                message += `${bonusPointsLabel}: ${additionalInfo.bonus_points}\n`;
            }
            if (additionalInfo.social_credits !== undefined) {
                message += `${socialCreditsLabel}: ${additionalInfo.social_credits}\n`;
            }
            if (additionalInfo.cop_chase_rating !== undefined) {
                message += `${copchaseRatingLabel}: ${additionalInfo.cop_chase_rating}\n`;
            }
            // Remove color codes from prefix and achievement
            if (additionalInfo.prefix) {
                message += `${prefixLabel}: ${removeColorCodes(additionalInfo.prefix)}\n`;
            }
            if (additionalInfo.achievement) {
                message += `${achievementLabel}: ${removeColorCodes(additionalInfo.achievement)}\n`;
            }
        }
        // Add achievements section
        const badgeTranslations = loadTranslations(userLang, 'badges');
        // Import badgeData locally to avoid circular dependency
        const badgeData = [
            { id: 1, translationKey: "creator", category: "staff", icon: "👑" },
            { id: 2, translationKey: "admin", category: "staff", icon: "🛡️" },
            { id: 3, translationKey: "team", category: "staff", icon: "👥" },
            { id: 4, translationKey: "site", category: "staff", icon: "💻" },
            { id: 5, translationKey: "veteran", category: "player", icon: "🎖️" },
            { id: 6, translationKey: "youtuber", category: "player", icon: "📺" },
            { id: 7, translationKey: "exteam", category: "player", icon: "👋" },
            { id: 8, translationKey: "bot", category: "player", icon: "🤖" },
            { id: 9, translationKey: "chronos", category: "player", icon: "⏰" },
        ];
        // Add criteria functions to badge data
        const badgeDataWithCriteria = badgeData.map((badge) => {
            let criteriaFunction;
            switch (badge.translationKey) {
                case "creator":
                    criteriaFunction = (playerData, additionalInfo) => playerData.id === 1 || playerData.id === 2;
                    break;
                case "admin":
                    criteriaFunction = (playerData, additionalInfo) => playerData.moder === 999;
                    break;
                case "team":
                    criteriaFunction = (playerData, additionalInfo) => playerData.moder > 0;
                    break;
                case "site":
                    criteriaFunction = (playerData, additionalInfo) => playerData.id === 125043 || playerData.id === 113145;
                    break;
                case "veteran":
                    criteriaFunction = (playerData, additionalInfo) => playerData.id < 130000;
                    break;
                case "youtuber":
                    criteriaFunction = (playerData, additionalInfo) => playerData.verify === 5;
                    break;
                case "exteam":
                    criteriaFunction = (playerData, additionalInfo) => playerData.verify === 4;
                    break;
                case "bot":
                    criteriaFunction = (playerData, additionalInfo) => playerData.verify === 6;
                    break;
                case "chronos":
                    criteriaFunction = (playerData, additionalInfo) => playerData.verify === 7;
                    break;
                default:
                    criteriaFunction = (playerData, additionalInfo) => false;
            }
            return Object.assign(Object.assign({}, badge), { criteriaFunction });
        });
        // Filter badges based on player data
        const earnedBadges = badgeDataWithCriteria.filter(badge => badge.criteriaFunction(playerData, additionalInfo));
        // Add earned badges to message
        if (earnedBadges.length > 0) {
            message += `\n${t(userLang, 'badges', 'title')}:\n`;
            for (const badge of earnedBadges) {
                const translation = badgeTranslations.items[badge.translationKey];
                if (translation) {
                    message += `${badge.icon} ${translation.title}\n`;
                    message += `${translation.description}\n\n`;
                }
            }
        }
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        try {
            await ctx.editMessageText(message, backKeyboard);
        }
        catch (error) {
            // If editing fails, send a new message instead
            await ctx.reply(message, backKeyboard);
        }
    }
    catch (error) {
        const errorMessage = t(userLang, 'common', 'player_info_error', { error: error.message });
        const backKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(userLang, 'common', 'menu_back'), 'menu_main')]
        ]);
        try {
            await ctx.editMessageText(errorMessage, backKeyboard);
        }
        catch (editError) {
            // If editing fails, send a new message instead
            await ctx.reply(errorMessage, backKeyboard);
        }
    }
    // Reset user state after processing
    userStates[userId] = { waitingForNickname: false };
};
//# sourceMappingURL=menu.js.map