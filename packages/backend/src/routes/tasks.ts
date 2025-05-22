import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { TaskModel, CreateTaskRequest, UpdateTaskRequest } from '../db/models/task';
import { DatabaseContext } from '../middleware/database';
import { TaskService } from '../services/taskService';
import { logger } from '../lib/logger';

const tasks = new Hono<{ Variables: DatabaseContext }>();

// CORS middleware for frontend integration
tasks.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// GET /api/v1/tasks - Get all tasks with optional filters
tasks.get('/', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const service = new TaskService(taskModel);
        const query = c.req.query();

        const filters = {
            tag: query.tag,
            overdue: query.overdue === 'true' ? true : query.overdue === 'false' ? false : undefined,
            public: query.public === 'true' ? true : query.public === 'false' ? false : undefined,
            userId: query.userId
        };

        const result = await service.listTasks(filters);
        logger.info('route=tasks method=GET action=list status=200');
        return c.json({
            success: true,
            data: result,
            count: result.length
        });
    } catch (error) {
        logger.error('route=tasks method=GET action=list error', { error });
        return c.json({
            success: false,
            error: 'Failed to fetch tasks',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// POST /api/v1/tasks - Create a new task
tasks.post('/', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const service = new TaskService(taskModel);
        const body = await c.req.json() as CreateTaskRequest;

        // Basic validation
        if (!body.title || body.title.trim() === '') {
            logger.info('route=tasks method=POST action=create status=400');
            return c.json({
                success: false,
                error: 'Validation failed',
                message: 'Title is required'
            }, 400);
        }

        const task = await service.createTask(body);
        logger.info('route=tasks method=POST action=create status=201', { id: task.id });
        return c.json({
            success: true,
            data: task
        }, 201);
    } catch (error) {
        logger.error('route=tasks method=POST action=create error', { error });
        return c.json({
            success: false,
            error: 'Failed to create task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// GET /api/v1/tasks/:id - Get a specific task by ID
tasks.get('/:id', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const service = new TaskService(taskModel);
        const id = c.req.param('id');

        const task = await service.getTaskById(id);

        if (!task) {
            logger.info('route=tasks method=GET action=getById status=404', { id });
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }
        logger.info('route=tasks method=GET action=getById status=200', { id });
        return c.json({
            success: true,
            data: task
        });
    } catch (error) {
        logger.error('route=tasks method=GET action=getById error', { error });
        return c.json({
            success: false,
            error: 'Failed to fetch task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// PUT /api/v1/tasks/:id - Update a specific task
tasks.put('/:id', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const service = new TaskService(taskModel);
        const id = c.req.param('id');
        const body = await c.req.json() as UpdateTaskRequest;

        const task = await service.updateTask(id, body);

        if (!task) {
            logger.info('route=tasks method=PUT action=update status=404', { id });
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }
        logger.info('route=tasks method=PUT action=update status=200', { id });
        return c.json({
            success: true,
            data: task
        });
    } catch (error) {
        logger.error('route=tasks method=PUT action=update error', { error });
        return c.json({
            success: false,
            error: 'Failed to update task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// DELETE /api/v1/tasks/:id - Delete a specific task
tasks.delete('/:id', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const service = new TaskService(taskModel);
        const id = c.req.param('id');

        const deleted = await service.deleteTask(id);

        if (!deleted) {
            logger.info('route=tasks method=DELETE action=delete status=404', { id });
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }
        logger.info('route=tasks method=DELETE action=delete status=204', { id });
        return c.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        logger.error('route=tasks method=DELETE action=delete error', { error });
        return c.json({
            success: false,
            error: 'Failed to delete task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

export { tasks }; 