export declare const setUserLanguage: (userId: string, languageCode: string) => Promise<void>;
export declare const getUserLanguage: (userId: string) => Promise<string>;
export declare const loadTranslations: (languageCode: string, namespace: string) => any;
export declare const getTranslation: (languageCode: string, namespace: string, key: string, fallback?: string) => string;
export declare const t: (languageCode: string, namespace: string, key: string, params?: Record<string, any>) => string;
//# sourceMappingURL=language.d.ts.map