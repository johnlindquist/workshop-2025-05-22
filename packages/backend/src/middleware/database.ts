import { Context, Next } from 'hono';
import { DatabaseConnection, Env } from '../db/connection';
import { TaskModel } from '../db/models/task';

export interface DatabaseContext {
    db: DatabaseConnection;
    taskModel: TaskModel;
}

export const databaseMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    const logLevel = c.env.LOG_LEVEL || 'info';
    const db = new DatabaseConnection(c.env.DB, logLevel);
    const taskModel = new TaskModel(db);

    c.set('db', db);
    c.set('taskModel', taskModel);

    await next();
}; 