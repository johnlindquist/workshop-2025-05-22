import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { OverdueService } from '../services/overdueService';
import { DatabaseContext } from '../middleware/database';

const notifications = new Hono<{ Variables: DatabaseContext }>();

// CORS middleware for frontend integration
notifications.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// GET /api/v1/notifications/overdue - Get overdue tasks for notifications
notifications.get('/overdue', async (c) => {
    try {
        const db = c.get('db');
        const overdueService = new OverdueService(db);
        const query = c.req.query();
        const userId = query.userId;

        const overdueTasks = await overdueService.getOverdueTasks(userId);

        return c.json({
            success: true,
            data: overdueTasks,
            count: overdueTasks.length,
            message: overdueTasks.length > 0
                ? `Found ${overdueTasks.length} overdue task(s)`
                : 'No overdue tasks found'
        });
    } catch (error) {
        console.error('Error fetching overdue tasks:', error);
        return c.json({
            success: false,
            error: 'Failed to fetch overdue tasks',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// POST /api/v1/notifications/overdue/update - Manually trigger overdue status update
notifications.post('/overdue/update', async (c) => {
    try {
        const db = c.get('db');
        const overdueService = new OverdueService(db);

        const result = await overdueService.updateOverdueStatus();

        return c.json({
            success: true,
            data: {
                updatedCount: result.updatedCount,
                overdueTasksCount: result.overdueTasks.length
            },
            message: `Updated ${result.updatedCount} task(s), ${result.overdueTasks.length} task(s) are now overdue`
        });
    } catch (error) {
        console.error('Error updating overdue status:', error);
        return c.json({
            success: false,
            error: 'Failed to update overdue status',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// POST /api/v1/notifications/overdue/send - Send notifications for overdue tasks
notifications.post('/overdue/send', async (c) => {
    try {
        const db = c.get('db');
        const overdueService = new OverdueService(db);
        const body = await c.req.json().catch(() => ({}));
        const userId = body.userId;

        const result = await overdueService.sendOverdueNotifications(userId);

        return c.json({
            success: true,
            data: {
                notificationsSent: result.notificationsSent
            },
            message: `Would send ${result.notificationsSent} notification(s) for overdue tasks`
        });
    } catch (error) {
        console.error('Error sending overdue notifications:', error);
        return c.json({
            success: false,
            error: 'Failed to send overdue notifications',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

export { notifications }; 