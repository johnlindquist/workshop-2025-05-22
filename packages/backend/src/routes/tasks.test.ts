import { Hono } from 'hono';
import { tasks } from './tasks';
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

describe('Tasks API Routes', () => {
    let app: Hono;

    beforeEach(() => {
        jest.clearAllMocks();
        app = new Hono();
        app.use('*', mockDatabaseMiddleware);
        app.route('/', tasks);
    });

    describe('POST /', () => {
        it('should create a task successfully', async () => {
            const mockTask = {
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                tags: ['test'],
                isPublic: false,
                isOverdue: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: '["test"]',
                isPublic: 0,
                isOverdue: 0,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            const response = await app.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Test Task',
                    content: 'Test content',
                    tags: ['test']
                })
            });

            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.title).toBe('Test Task');
        });

        it('should return 400 for missing title', async () => {
            const response = await app.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: 'Test content without title'
                })
            });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Validation failed');
        });
    });

    describe('GET /', () => {
        it('should get all tasks', async () => {
            const mockTasks = [
                {
                    id: 'task-1',
                    title: 'Task 1',
                    content: 'Content 1',
                    dueDate: null,
                    tags: null,
                    isPublic: 0,
                    isOverdue: 0,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    userId: null
                }
            ];

            mockD1Database.all.mockResolvedValueOnce({ results: mockTasks });

            const response = await app.request('/');

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.count).toBe(1);
            expect(data.data).toHaveLength(1);
        });
    });

    describe('GET /:id', () => {
        it('should get a task by ID', async () => {
            const mockTask = {
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: '["test"]',
                isPublic: 0,
                isOverdue: 0,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            };

            mockD1Database.first.mockResolvedValueOnce(mockTask);

            const response = await app.request('/test-id');

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.id).toBe('test-id');
        });

        it('should return 404 for non-existent task', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const response = await app.request('/non-existent');

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Task not found');
        });
    });

    describe('PUT /:id', () => {
        it('should update a task', async () => {
            // Mock existing task
            mockD1Database.first
                .mockResolvedValueOnce({
                    id: 'test-id',
                    title: 'Original Task',
                    content: 'Original content',
                    dueDate: null,
                    tags: null,
                    isPublic: 0,
                    isOverdue: 0,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    userId: null
                })
                .mockResolvedValueOnce({
                    id: 'test-id',
                    title: 'Updated Task',
                    content: 'Updated content',
                    dueDate: null,
                    tags: null,
                    isPublic: 0,
                    isOverdue: 0,
                    shareId: null,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T01:00:00.000Z',
                    userId: null
                });

            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const response = await app.request('/test-id', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Updated Task',
                    content: 'Updated content'
                })
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.title).toBe('Updated Task');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a task', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const response = await app.request('/test-id', {
                method: 'DELETE'
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.message).toBe('Task deleted successfully');
        });

        it('should return 404 for non-existent task', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 0 } });

            const response = await app.request('/non-existent', {
                method: 'DELETE'
            });

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBe('Task not found');
        });
    });
}); 