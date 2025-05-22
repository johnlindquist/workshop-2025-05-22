import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { TaskModel } from '../db/models/task';
import { DatabaseContext } from '../middleware/database';

const sharing = new Hono<{ Variables: DatabaseContext }>();

// CORS middleware for frontend integration
sharing.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// POST /api/v1/tasks/:id/share - Make a task public and generate share URL
sharing.post('/:id/share', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const id = c.req.param('id');

        // Check if task exists
        const task = await taskModel.getTaskById(id);
        if (!task) {
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }

        // Make task public and get share ID
        const shareId = await taskModel.makeTaskPublic(id);
        if (!shareId) {
            return c.json({
                success: false,
                error: 'Failed to share task',
                message: 'Could not generate share URL for the task'
            }, 500);
        }

        const shareUrl = `${c.req.url.split('/api')[0]}/shared/${shareId}`;

        console.log(JSON.stringify({
            level: 'INFO',
            message: 'Task shared successfully',
            timestamp: new Date().toISOString(),
            taskId: id,
            shareId,
            shareUrl
        }));

        return c.json({
            success: true,
            data: {
                shareId,
                shareUrl,
                isPublic: true
            }
        });
    } catch (error) {
        console.error('Error sharing task:', error);
        return c.json({
            success: false,
            error: 'Failed to share task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// DELETE /api/v1/tasks/:id/share - Make a task private (remove sharing)
sharing.delete('/:id/share', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const id = c.req.param('id');

        // Check if task exists
        const task = await taskModel.getTaskById(id);
        if (!task) {
            return c.json({
                success: false,
                error: 'Task not found',
                message: `Task with ID ${id} does not exist`
            }, 404);
        }

        const success = await taskModel.makeTaskPrivate(id);
        if (!success) {
            return c.json({
                success: false,
                error: 'Failed to unshare task',
                message: 'Could not make the task private'
            }, 500);
        }

        console.log(JSON.stringify({
            level: 'INFO',
            message: 'Task unshared successfully',
            timestamp: new Date().toISOString(),
            taskId: id
        }));

        return c.json({
            success: true,
            message: 'Task is now private',
            data: {
                isPublic: false
            }
        });
    } catch (error) {
        console.error('Error unsharing task:', error);
        return c.json({
            success: false,
            error: 'Failed to unshare task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// GET /api/v1/shared/:shareId - Access a public task by share ID
sharing.get('/shared/:shareId', async (c) => {
    try {
        const taskModel = c.get('taskModel') as TaskModel;
        const shareId = c.req.param('shareId');

        const task = await taskModel.getTaskByShareId(shareId);
        if (!task) {
            return c.json({
                success: false,
                error: 'Shared task not found',
                message: `No public task found with share ID ${shareId}`
            }, 404);
        }

        console.log(JSON.stringify({
            level: 'INFO',
            message: 'Shared task accessed',
            timestamp: new Date().toISOString(),
            shareId,
            taskId: task.id
        }));

        return c.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error accessing shared task:', error);
        return c.json({
            success: false,
            error: 'Failed to access shared task',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

export { sharing }; 