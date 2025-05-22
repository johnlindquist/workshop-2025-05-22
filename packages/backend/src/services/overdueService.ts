import { TaskModel } from '../db/models/task';
import { DatabaseConnection } from '../db/connection';

export class OverdueService {
    private taskModel: TaskModel;
    private intervalId?: NodeJS.Timeout;

    constructor(db: DatabaseConnection) {
        this.taskModel = new TaskModel(db);
    }

    // Update overdue status for all tasks
    async updateOverdueStatus(): Promise<{ updatedCount: number; overdueTasks: any[] }> {
        try {
            console.log(JSON.stringify({
                level: 'INFO',
                message: 'Starting overdue status update',
                timestamp: new Date().toISOString()
            }));

            const updatedCount = await this.taskModel.updateOverdueStatus();
            const overdueTasks = await this.taskModel.getOverdueTasks();

            console.log(JSON.stringify({
                level: 'INFO',
                message: 'Overdue status update completed',
                timestamp: new Date().toISOString(),
                updatedCount,
                overdueTasksCount: overdueTasks.length
            }));

            return { updatedCount, overdueTasks };
        } catch (error) {
            console.error(JSON.stringify({
                level: 'ERROR',
                message: 'Failed to update overdue status',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : String(error)
            }));
            throw error;
        }
    }

    // Get all overdue tasks
    async getOverdueTasks(userId?: string): Promise<any[]> {
        try {
            const overdueTasks = await this.taskModel.getOverdueTasks(userId);

            console.log(JSON.stringify({
                level: 'INFO',
                message: 'Retrieved overdue tasks',
                timestamp: new Date().toISOString(),
                count: overdueTasks.length,
                userId: userId || 'all'
            }));

            return overdueTasks;
        } catch (error) {
            console.error(JSON.stringify({
                level: 'ERROR',
                message: 'Failed to retrieve overdue tasks',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : String(error)
            }));
            throw error;
        }
    }

    // Start scheduled overdue detection (runs every hour)
    startScheduledUpdates(intervalMinutes: number = 60): void {
        if (this.intervalId) {
            console.log('Overdue detection is already running');
            return;
        }

        console.log(JSON.stringify({
            level: 'INFO',
            message: 'Starting scheduled overdue detection',
            timestamp: new Date().toISOString(),
            intervalMinutes
        }));

        this.intervalId = setInterval(async () => {
            try {
                await this.updateOverdueStatus();
            } catch (error) {
                console.error('Scheduled overdue update failed:', error);
            }
        }, intervalMinutes * 60 * 1000);
    }

    // Stop scheduled overdue detection
    stopScheduledUpdates(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;

            console.log(JSON.stringify({
                level: 'INFO',
                message: 'Stopped scheduled overdue detection',
                timestamp: new Date().toISOString()
            }));
        }
    }

    // Send notifications for overdue tasks (placeholder for future implementation)
    async sendOverdueNotifications(userId?: string): Promise<{ notificationsSent: number }> {
        try {
            const overdueTasks = await this.getOverdueTasks(userId);

            // Placeholder for notification logic
            // In a real implementation, this would integrate with email/SMS/push notification services
            console.log(JSON.stringify({
                level: 'INFO',
                message: 'Overdue notifications would be sent',
                timestamp: new Date().toISOString(),
                taskCount: overdueTasks.length,
                tasks: overdueTasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    dueDate: task.dueDate
                }))
            }));

            return { notificationsSent: overdueTasks.length };
        } catch (error) {
            console.error(JSON.stringify({
                level: 'ERROR',
                message: 'Failed to send overdue notifications',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : String(error)
            }));
            throw error;
        }
    }
} 