import { DatabaseConnection } from './connection';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Migration {
    id: string;
    filename: string;
    sql: string;
}

export class MigrationRunner {
    private db: DatabaseConnection;

    constructor(db: DatabaseConnection) {
        this.db = db;
    }

    async initializeMigrationsTable(): Promise<void> {
        const query = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        executed_at TEXT NOT NULL
      )
    `;

        await this.db.executeQuery(query);
    }

    async getExecutedMigrations(): Promise<string[]> {
        await this.initializeMigrationsTable();

        const query = 'SELECT id FROM _migrations ORDER BY executed_at';
        const rows = await this.db.executeQueryAll<{ id: string }>(query);

        return rows.map(row => row.id);
    }

    async markMigrationAsExecuted(migrationId: string, filename: string): Promise<void> {
        const query = 'INSERT INTO _migrations (id, filename, executed_at) VALUES (?, ?, ?)';
        const params = [migrationId, filename, new Date().toISOString()];

        await this.db.executeQuery(query, params);
    }

    async runMigration(migration: Migration): Promise<void> {
        console.log(`Running migration: ${migration.filename}`);

        // Split SQL by semicolons and execute each statement
        const statements = migration.sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
            await this.db.executeQuery(statement);
        }

        await this.markMigrationAsExecuted(migration.id, migration.filename);
        console.log(`Migration completed: ${migration.filename}`);
    }

    async runPendingMigrations(migrationsPath: string): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();

        // For now, we'll manually define the migration
        // In a real app, you'd scan the migrations directory
        const migrations: Migration[] = [
            {
                id: '0001',
                filename: '0001_initial_schema.sql',
                sql: readFileSync(join(migrationsPath, '0001_initial_schema.sql'), 'utf-8')
            }
        ];

        const pendingMigrations = migrations.filter(
            migration => !executedMigrations.includes(migration.id)
        );

        if (pendingMigrations.length === 0) {
            console.log('No pending migrations');
            return;
        }

        console.log(`Running ${pendingMigrations.length} pending migrations`);

        for (const migration of pendingMigrations) {
            await this.runMigration(migration);
        }

        console.log('All migrations completed successfully');
    }
} 