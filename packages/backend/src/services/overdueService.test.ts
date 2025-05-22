import { OverdueService } from './overdueService';
import { TaskModel } from '../db/models/task';
import { DatabaseConnection } from '../db/connection';

// Mock D1Database for testing
const mockD1Database = {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
    all: jest.fn(),
    first: jest.fn(),
};

describe('OverdueService', () => {
    let overdueService: OverdueService;
    let dbConnection: DatabaseConnection;

    beforeEach(() => {
        jest.clearAllMocks();
        dbConnection = new DatabaseConnection(mockD1Database as any, 'debug');
        overdueService = new OverdueService(dbConnection);
    });

    describe('updateOverdueStatus', () => {
        it('should update overdue status and return results', async () => {
            const mockOverdueTasks = [
                {
                    id: 'overdue-1',
                    title: 'Overdue Task 1',
                    content: null,
                    dueDate: '2024-01-01T00:00:00.000Z',
                    tags: null,
                    isPublic: 0,
                    isOverdue: 1,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    userId: null
                }
            ];

            // Mock update operation
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 2 } });
            // Mock get overdue tasks
            mockD1Database.all.mockResolvedValueOnce({ results: mockOverdueTasks });

            const result = await overdueService.updateOverdueStatus();

            expect(result.updatedCount).toBe(2);
            expect(result.overdueTasks).toHaveLength(1);
            expect(result.overdueTasks[0].isOverdue).toBe(true);
        });

        it('should handle errors during update', async () => {
            mockD1Database.run.mockRejectedValueOnce(new Error('Database error'));

            await expect(overdueService.updateOverdueStatus()).rejects.toThrow('Database error');
        });
    });

    describe('getOverdueTasks', () => {
        it('should return overdue tasks for all users', async () => {
            const mockOverdueTasks = [
                {
                    id: 'overdue-1',
                    title: 'Overdue Task 1',
                    content: null,
                    dueDate: '2024-01-01T00:00:00.000Z',
                    tags: null,
                    isPublic: 0,
                    isOverdue: 1,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    userId: null
                },
                {
                    id: 'overdue-2',
                    title: 'Overdue Task 2',
                    content: null,
                    dueDate: '2024-01-02T00:00:00.000Z',
                    tags: null,
                    isPublic: 0,
                    isOverdue: 1,
                    shareId: null,
                    createdAt: '2024-01-02T00:00:00.000Z',
                    updatedAt: '2024-01-02T00:00:00.000Z',
                    userId: 'user-1'
                }
            ];

            mockD1Database.all.mockResolvedValueOnce({ results: mockOverdueTasks });

            const result = await overdueService.getOverdueTasks();

            expect(result).toHaveLength(2);
            expect(result[0].isOverdue).toBe(true);
            expect(result[1].isOverdue).toBe(true);
        });

        it('should return overdue tasks for specific user', async () => {
            const mockOverdueTasks = [
                {
                    id: 'overdue-2',
                    title: 'Overdue Task 2',
                    content: null,
                    dueDate: '2024-01-02T00:00:00.000Z',
                    tags: null,
                    isPublic: 0,
                    isOverdue: 1,
                    shareId: null,
                    createdAt: '2024-01-02T00:00:00.000Z',
                    updatedAt: '2024-01-02T00:00:00.000Z',
                    userId: 'user-1'
                }
            ];

            mockD1Database.all.mockResolvedValueOnce({ results: mockOverdueTasks });

            const result = await overdueService.getOverdueTasks('user-1');

            expect(result).toHaveLength(1);
            expect(result[0].userId).toBe('user-1');
        });

        it('should handle errors during retrieval', async () => {
            mockD1Database.all.mockRejectedValueOnce(new Error('Database error'));

            await expect(overdueService.getOverdueTasks()).rejects.toThrow('Database error');
        });
    });

    describe('sendOverdueNotifications', () => {
        it('should return notification count for overdue tasks', async () => {
            const mockOverdueTasks = [
                {
                    id: 'overdue-1',
                    title: 'Overdue Task 1',
                    content: null,
                    dueDate: '2024-01-01T00:00:00.000Z',
                    tags: null,
                    isPublic: 0,
                    isOverdue: 1,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    userId: null
                }
            ];

            mockD1Database.all.mockResolvedValueOnce({ results: mockOverdueTasks });

            const result = await overdueService.sendOverdueNotifications();

            expect(result.notificationsSent).toBe(1);
        });

        it('should return zero notifications when no overdue tasks', async () => {
            mockD1Database.all.mockResolvedValueOnce({ results: [] });

            const result = await overdueService.sendOverdueNotifications();

            expect(result.notificationsSent).toBe(0);
        });
    });

    describe('scheduled updates', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should start and stop scheduled updates', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            // Start scheduled updates (every 1 minute for testing)
            overdueService.startScheduledUpdates(1);

            // Stop scheduled updates
            overdueService.stopScheduledUpdates();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Starting scheduled overdue detection')
            );
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Stopped scheduled overdue detection')
            );

            consoleSpy.mockRestore();
        });

        it('should not start multiple scheduled updates', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            overdueService.startScheduledUpdates(1);
            overdueService.startScheduledUpdates(1); // Second call should be ignored

            expect(consoleSpy).toHaveBeenCalledWith('Overdue detection is already running');

            overdueService.stopScheduledUpdates();
            consoleSpy.mockRestore();
        });
    });
}); 