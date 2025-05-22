import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { TaskModel, CreateTaskRequest, UpdateTaskRequest } from '../db/models/task';
import { DatabaseContext } from '../middleware/database';

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
        const query = c.req.query();

        const filters = {
            tag: query.tag,
            overdue: query.overdue === 'true' ? true : query.overdue === 'false' ? false : undefined,
            public: query.public === 'true' ? true : query.public === 'false' ? false : undefined,
            userId: query.userId
        };

        const tasks = await taskModel.getAllTasks(filters);

        return c.json({
            success: true,
            data: tasks,
            count: tasks.length
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
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
        const body = await c.req.json() as CreateTaskRequest;

        // Basic validation
        if (!body.title || body.title.trim() === '') {
            return c.json({
                success: false,
                error: 'Validation failed',
                message: 'Title is required'
            }, 400);
        }

        const task = await taskModel.createTask(body);

        return c.json({
            success: true,
            data: task
        }, 201);
    } catch (error) {
        console.error('Error creating task:', error);
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
        const id = c.req.param('id');

        const task = await taskModel.getTaskById(id);

        if (!task) {
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }

        return c.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error fetching task:', error);
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
        const id = c.req.param('id');
        const body = await c.req.json() as UpdateTaskRequest;

        const task = await taskModel.updateTask(id, body);

        if (!task) {
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }

        return c.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error updating task:', error);
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
        const id = c.req.param('id');

        const deleted = await taskModel.deleteTask(id);

        if (!deleted) {
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }

        return c.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return c.json({
            success: false,
            error: 'Failed to delete task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

export { tasks }; 