declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            OPEN_AI_SECRET_KEY: string;
        }
    }
}

export {};
