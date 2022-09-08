declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            TRUSTED_USERS: string[];
            PREFIX: string;
            RSS_LIMIT: number;
            ANILIST_API?: string;
            CLIENT_ID: number;
            GUILD_ID: number
        }
    }
}

export = {};