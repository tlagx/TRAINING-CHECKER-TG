import fs from 'fs';
import path from 'path';
const LANGUAGE_FILE = path.join(process.cwd(), 'user_languages.json');
// In-memory cache for user languages
let userLanguages = {};
// Load user languages from file on startup
if (fs.existsSync(LANGUAGE_FILE)) {
    try {
        const data = fs.readFileSync(LANGUAGE_FILE, 'utf8');
        userLanguages = JSON.parse(data);
    }
    catch (error) {
        console.error('Error loading user languages:', error);
        userLanguages = {};
    }
}
// Save user languages to file
const saveUserLanguages = () => {
    try {
        fs.writeFileSync(LANGUAGE_FILE, JSON.stringify(userLanguages, null, 2));
    }
    catch (error) {
        console.error('Error saving user languages:', error);
    }
};
export const setUserLanguage = async (userId, languageCode) => {
    userLanguages[userId] = languageCode;
    saveUserLanguages();
};
export const getUserLanguage = async (userId) => {
    return userLanguages[userId] || 'en'; // default to English
};
export const loadTranslations = (languageCode, namespace) => {
    try {
        const filePath = path.join(process.cwd(), 'locales', languageCode, `${namespace}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error(`Error loading translations for ${languageCode}/${namespace}:`, error);
    }
    return {};
};
// Get a translated phrase with fallback to English
export const getTranslation = (languageCode, namespace, key, fallback = '') => {
    const translations = loadTranslations(languageCode, namespace);
    const keys = key.split('.');
    let value = translations;
    // Navigate through nested keys
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        }
        else {
            // Fallback to English if key not found
            if (languageCode !== 'en') {
                const enTranslations = loadTranslations('en', namespace);
                let enValue = enTranslations;
                for (const ek of keys) {
                    if (enValue && typeof enValue === 'object' && ek in enValue) {
                        enValue = enValue[ek];
                    }
                    else {
                        return fallback;
                    }
                }
                return enValue || fallback;
            }
            return fallback;
        }
    }
    return value || fallback;
};
export const t = (languageCode, namespace, key, params) => {
    const translations = loadTranslations(languageCode, namespace);
    // Navigate to the translation key
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        }
        else {
            // Return the key if translation not found
            return key;
        }
    }
    // If value is a string and we have params, replace placeholders
    if (typeof value === 'string' && params) {
        Object.keys(params).forEach(param => {
            value = value.replace(`{{${param}}}`, params[param]);
        });
    }
    return value;
};
//# sourceMappingURL=language.js.map