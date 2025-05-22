import { Hono } from 'hono';
import { sharing } from './sharing';
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

// Mock middleware to inject database context
const mockDatabaseMiddleware = async (c: any, next: any) => {
    const db = new DatabaseConnection(mockD1Database as any, 'debug');
    const taskModel = new TaskModel(db);
    c.set('taskModel', taskModel);
    await next();
};

describe('Sharing API Routes', () => {
    let app: Hono;

    beforeEach(() => {
        jest.clearAllMocks();
        app = new Hono();
        app.use('*', mockDatabaseMiddleware);
        app.route('/', sharing);
    });

    describe('POST /:id/share', () => {
        it('should share a task successfully', async () => {
            // Mock existing task
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: null,
                isPublic: 0,
                isOverdue: 0,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            // Mock successful sharing
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const response = await app.request('/test-id/share', {
                method: 'POST'
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.isPublic).toBe(true);
            expect(data.data.shareId).toBeTruthy();
            expect(data.data.shareUrl).toContain('/shared/');
        });

        it('should return 404 for non-existent task', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const response = await app.request('/non-existent/share', {
                method: 'POST'
            });

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Task not found');
        });

        it('should return 500 when sharing fails', async () => {
            // Mock existing task
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: null,
                isPublic: 0,
                isOverdue: 0,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            // Mock failed sharing
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 0 } });

            const response = await app.request('/test-id/share', {
                method: 'POST'
            });

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Failed to share task');
        });
    });

    describe('DELETE /:id/share', () => {
        it('should unshare a task successfully', async () => {
            // Mock existing shared task
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: null,
                isPublic: 1,
                isOverdue: 0,
                shareId: 'share123',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            // Mock successful unsharing
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const response = await app.request('/test-id/share', {
                method: 'DELETE'
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.isPublic).toBe(false);
            expect(data.message).toBe('Task is now private');
        });

        it('should return 404 for non-existent task', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const response = await app.request('/non-existent/share', {
                method: 'DELETE'
            });

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Task not found');
        });
    });

    describe('GET /shared/:shareId', () => {
        it('should access a shared task successfully', async () => {
            const mockSharedTask = {
                id: 'test-id',
                title: 'Shared Task',
                content: 'Shared content',
                dueDate: null,
                tags: '["public"]',
                isPublic: 1,
                isOverdue: 0,
                shareId: 'share123',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            };

            mockD1Database.first.mockResolvedValueOnce(mockSharedTask);

            const response = await app.request('/shared/share123');

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.id).toBe('test-id');
            expect(data.data.title).toBe('Shared Task');
            expect(data.data.isPublic).toBe(true);
        });

        it('should return 404 for non-existent share ID', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const response = await app.request('/shared/non-existent');

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Shared task not found');
        });
    });
}); 