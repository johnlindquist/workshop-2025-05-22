import type { TaskModel, CreateTaskRequest, UpdateTaskRequest, Task } from '../db/models/task';
import { logger } from '../lib/logger';

export class TaskService {
    private taskModel: TaskModel;

    constructor(taskModel: TaskModel) {
        this.taskModel = taskModel;
    }

    async listTasks(filters?: Record<string, unknown>) {
        logger.info('route=tasks method=GET action=list', { filters });
        return this.taskModel.getAllTasks(filters);
    }

    async createTask(data: CreateTaskRequest, userId?: string) {
        logger.info('route=tasks method=POST action=create', { data });
        const task = await this.taskModel.createTask(data, userId);
        logger.info('route=tasks method=POST action=create status=201', { id: task.id });
        return task;
    }

    async getTaskById(id: string) {
        logger.info('route=tasks method=GET action=getById', { id });
        return this.taskModel.getTaskById(id);
    }

    async updateTask(id: string, data: UpdateTaskRequest) {
        logger.info('route=tasks method=PUT action=update', { id, data });
        return this.taskModel.updateTask(id, data);
    }

    async deleteTask(id: string) {
        logger.info('route=tasks method=DELETE action=delete', { id });
        return this.taskModel.deleteTask(id);
    }
} 