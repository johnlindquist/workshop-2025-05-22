import { DatabaseConnection } from '../connection';

// TypeScript interfaces matching OpenAPI Task schema
export interface Task {
    id: string;
    title: string;
    content?: string;
    dueDate?: string; // ISO 8601 datetime string
    tags?: string[]; // Array of strings
    isPublic: boolean;
    isOverdue: boolean;
    shareId?: string;
    createdAt: string; // ISO 8601 datetime string
    updatedAt: string; // ISO 8601 datetime string
    userId?: string;
}

export interface CreateTaskRequest {
    title: string;
    content?: string;
    dueDate?: string;
    tags?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    content?: string;
    dueDate?: string;
    tags?: string[];
    isPublic?: boolean;
}

// Database row interface (SQLite representation)
interface TaskRow {
    id: string;
    title: string;
    content: string | null;
    dueDate: string | null;
    tags: string | null; // JSON string
    isPublic: number; // SQLite boolean (0/1)
    isOverdue: number; // SQLite boolean (0/1)
    shareId: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
}

export class TaskModel {
    private db: DatabaseConnection;

    constructor(db: DatabaseConnection) {
        this.db = db;
    }

    // Convert database row to Task interface
    private rowToTask(row: TaskRow): Task {
        return {
            id: row.id,
            title: row.title,
            content: row.content || undefined,
            dueDate: row.dueDate || undefined,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            isPublic: Boolean(row.isPublic),
            isOverdue: Boolean(row.isOverdue),
            shareId: row.shareId || undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            userId: row.userId || undefined,
        };
    }

    // Generate UUID v4
    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Check if task is overdue
    private isTaskOverdue(dueDate?: string): boolean {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }

    async createTask(data: CreateTaskRequest, userId?: string): Promise<Task> {
        const id = this.generateId();
        const now = new Date().toISOString();
        const isOverdue = this.isTaskOverdue(data.dueDate);

        const query = `
      INSERT INTO tasks (id, title, content, dueDate, tags, isPublic, isOverdue, createdAt, updatedAt, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            id,
            data.title,
            data.content || null,
            data.dueDate || null,
            data.tags ? JSON.stringify(data.tags) : null,
            0, // isPublic defaults to false
            isOverdue ? 1 : 0,
            now,
            now,
            userId || null
        ];

        await this.db.executeQuery(query, params);

        const task = await this.getTaskById(id);
        if (!task) {
            throw new Error('Failed to create task');
        }

        return task;
    }

    async getTaskById(id: string): Promise<Task | null> {
        const query = 'SELECT * FROM tasks WHERE id = ?';
        const row = await this.db.executeQueryFirst<TaskRow>(query, [id]);

        return row ? this.rowToTask(row) : null;
    }

    async getAllTasks(filters?: {
        tag?: string;
        overdue?: boolean;
        public?: boolean;
        userId?: string;
    }): Promise<Task[]> {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const params: any[] = [];

        if (filters?.userId) {
            query += ' AND userId = ?';
            params.push(filters.userId);
        }

        if (filters?.tag) {
            query += ' AND tags LIKE ?';
            params.push(`%"${filters.tag}"%`);
        }

        if (filters?.overdue !== undefined) {
            query += ' AND isOverdue = ?';
            params.push(filters.overdue ? 1 : 0);
        }

        if (filters?.public !== undefined) {
            query += ' AND isPublic = ?';
            params.push(filters.public ? 1 : 0);
        }

        query += ' ORDER BY createdAt DESC';

        const rows = await this.db.executeQueryAll<TaskRow>(query, params);
        return rows.map(row => this.rowToTask(row));
    }

    async updateTask(id: string, data: UpdateTaskRequest): Promise<Task | null> {
        const existingTask = await this.getTaskById(id);
        if (!existingTask) {
            return null;
        }

        const updates: string[] = [];
        const params: any[] = [];

        if (data.title !== undefined) {
            updates.push('title = ?');
            params.push(data.title);
        }

        if (data.content !== undefined) {
            updates.push('content = ?');
            params.push(data.content || null);
        }

        if (data.dueDate !== undefined) {
            updates.push('dueDate = ?');
            params.push(data.dueDate || null);

            // Update overdue status based on new due date
            const isOverdue = this.isTaskOverdue(data.dueDate);
            updates.push('isOverdue = ?');
            params.push(isOverdue ? 1 : 0);
        }

        if (data.tags !== undefined) {
            updates.push('tags = ?');
            params.push(data.tags ? JSON.stringify(data.tags) : null);
        }

        if (data.isPublic !== undefined) {
            updates.push('isPublic = ?');
            params.push(data.isPublic ? 1 : 0);
        }

        if (updates.length === 0) {
            return existingTask;
        }

        updates.push('updatedAt = ?');
        params.push(new Date().toISOString());

        const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        params.push(id);

        await this.db.executeQuery(query, params);

        return await this.getTaskById(id);
    }

    async deleteTask(id: string): Promise<boolean> {
        const query = 'DELETE FROM tasks WHERE id = ?';
        const result = await this.db.executeQuery(query, [id]);

        return (result.meta?.changes || 0) > 0;
    }

    async getTaskByShareId(shareId: string): Promise<Task | null> {
        const query = 'SELECT * FROM tasks WHERE shareId = ? AND isPublic = 1';
        const row = await this.db.executeQueryFirst<TaskRow>(query, [shareId]);

        return row ? this.rowToTask(row) : null;
    }

    async makeTaskPublic(id: string): Promise<string | null> {
        const shareId = this.generateId().substring(0, 12); // Shorter share ID

        const query = 'UPDATE tasks SET isPublic = 1, shareId = ?, updatedAt = ? WHERE id = ?';
        const params = [shareId, new Date().toISOString(), id];

        const result = await this.db.executeQuery(query, params);

        return (result.meta?.changes || 0) > 0 ? shareId : null;
    }

    async makeTaskPrivate(id: string): Promise<boolean> {
        const query = 'UPDATE tasks SET isPublic = 0, shareId = NULL, updatedAt = ? WHERE id = ?';
        const params = [new Date().toISOString(), id];

        const result = await this.db.executeQuery(query, params);

        return (result.meta?.changes || 0) > 0;
    }

    async updateOverdueStatus(): Promise<number> {
        const now = new Date().toISOString();
        const query = `
      UPDATE tasks 
      SET isOverdue = CASE 
        WHEN dueDate IS NOT NULL AND dueDate < ? THEN 1 
        ELSE 0 
      END,
      updatedAt = ?
      WHERE dueDate IS NOT NULL
    `;

        const result = await this.db.executeQuery(query, [now, now]);
        return result.meta?.changes || 0;
    }

    async getOverdueTasks(userId?: string): Promise<Task[]> {
        let query = 'SELECT * FROM tasks WHERE isOverdue = 1';
        const params: any[] = [];

        if (userId) {
            query += ' AND userId = ?';
            params.push(userId);
        }

        query += ' ORDER BY dueDate ASC';

        const rows = await this.db.executeQueryAll<TaskRow>(query, params);
        return rows.map(row => this.rowToTask(row));
    }
} 