import { D1Database, D1Result } from '@cloudflare/workers-types';

export interface Env {
    DB: D1Database;
    LOG_LEVEL?: string;
}

export class DatabaseConnection {
    private db: D1Database;
    private logLevel: string;

    constructor(db: D1Database, logLevel: string = 'info') {
        this.db = db;
        this.logLevel = logLevel;
        this.log('debug', 'Database connection established', {
            timestamp: new Date().toISOString(),
            database: 'workshop-2025-05-22'
        });
    }

    getDatabase(): D1Database {
        return this.db;
    }

    private log(level: string, message: string, data?: any) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        const currentLevel = levels[this.logLevel as keyof typeof levels] || 1;
        const messageLevel = levels[level as keyof typeof levels] || 1;

        if (messageLevel >= currentLevel) {
            const logData = {
                level: level.toUpperCase(),
                message,
                timestamp: new Date().toISOString(),
                ...data
            };
            console.log(JSON.stringify(logData));
        }
    }

    async executeQuery(query: string, params: any[] = []): Promise<D1Result> {
        const startTime = Date.now();
        try {
            this.log('debug', 'Executing database query', { query, params });
            const result = await this.db.prepare(query).bind(...params).run();
            const duration = Date.now() - startTime;

            this.log('debug', 'Query executed successfully', {
                query,
                duration: `${duration}ms`,
                rowsAffected: result.meta?.changes || 0
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.log('error', 'Database query failed', {
                query,
                params,
                duration: `${duration}ms`,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    async executeQueryAll<T = any>(query: string, params: any[] = []): Promise<T[]> {
        const startTime = Date.now();
        try {
            this.log('debug', 'Executing database query (all results)', { query, params });
            const result = await this.db.prepare(query).bind(...params).all();
            const duration = Date.now() - startTime;

            this.log('debug', 'Query executed successfully', {
                query,
                duration: `${duration}ms`,
                rowCount: result.results?.length || 0
            });

            return result.results as T[];
        } catch (error) {
            const duration = Date.now() - startTime;
            this.log('error', 'Database query failed', {
                query,
                params,
                duration: `${duration}ms`,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    async executeQueryFirst<T = any>(query: string, params: any[] = []): Promise<T | null> {
        const startTime = Date.now();
        try {
            this.log('debug', 'Executing database query (first result)', { query, params });
            const result = await this.db.prepare(query).bind(...params).first();
            const duration = Date.now() - startTime;

            this.log('debug', 'Query executed successfully', {
                query,
                duration: `${duration}ms`,
                hasResult: !!result
            });

            return result as T | null;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.log('error', 'Database query failed', {
                query,
                params,
                duration: `${duration}ms`,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
} 