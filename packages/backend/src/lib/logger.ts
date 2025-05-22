import process from 'node:process';

const LOG_LEVELS = ['debug', 'info', 'error'] as const;
type LogLevel = typeof LOG_LEVELS[number];

const getLogLevel = (): LogLevel => {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    if (level && LOG_LEVELS.includes(level as LogLevel)) {
        return level as LogLevel;
    }
    return 'info';
};

const shouldLog = (level: LogLevel): boolean => {
    const current = getLogLevel();
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(current);
};

export const logger = {
    info: (msg: string, meta?: Record<string, unknown>) => {
        if (shouldLog('info')) {
            console.info(`INFO: ${msg}${meta ? ` ${JSON.stringify(meta)}` : ''}`);
        }
    },
    debug: (msg: string, meta?: Record<string, unknown>) => {
        if (shouldLog('debug')) {
            console.debug(`DEBUG: ${msg}${meta ? ` ${JSON.stringify(meta)}` : ''}`);
        }
    },
    error: (msg: string, meta?: Record<string, unknown>) => {
        if (shouldLog('error')) {
            console.error(`ERROR: ${msg}${meta ? ` ${JSON.stringify(meta)}` : ''}`);
        }
    },
}; 