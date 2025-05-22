import { TaskModel, CreateTaskRequest, UpdateTaskRequest } from './task';
import { DatabaseConnection } from '../connection';

// Mock D1Database for testing
const mockD1Database = {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
    all: jest.fn(),
    first: jest.fn(),
};

describe('TaskModel', () => {
    let taskModel: TaskModel;
    let dbConnection: DatabaseConnection;

    beforeEach(() => {
        jest.clearAllMocks();
        dbConnection = new DatabaseConnection(mockD1Database as any, 'debug');
        taskModel = new TaskModel(dbConnection);
    });

    describe('createTask', () => {
        it('should create a task successfully', async () => {
            const createRequest: CreateTaskRequest = {
                title: 'Test Task',
                content: 'Test content',
                tags: ['test', 'urgent']
            };

            // Mock the database responses
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                dueDate: null,
                tags: '["test","urgent"]',
                isPublic: 0,
                isOverdue: 0,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            const result = await taskModel.createTask(createRequest);

            expect(result).toEqual({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                tags: ['test', 'urgent'],
                isPublic: false,
                isOverdue: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            });

            expect(mockD1Database.prepare).toHaveBeenCalledTimes(2); // INSERT + SELECT
            expect(mockD1Database.run).toHaveBeenCalledTimes(1);
            expect(mockD1Database.first).toHaveBeenCalledTimes(1);
        });

        it('should create overdue task when due date is in the past', async () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
            const createRequest: CreateTaskRequest = {
                title: 'Overdue Task',
                dueDate: pastDate
            };

            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });
            mockD1Database.first.mockResolvedValueOnce({
                id: 'test-id',
                title: 'Overdue Task',
                content: null,
                dueDate: pastDate,
                tags: null,
                isPublic: 0,
                isOverdue: 1,
                shareId: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                userId: null
            });

            const result = await taskModel.createTask(createRequest);

            expect(result.isOverdue).toBe(true);
            expect(result.dueDate).toBe(pastDate);
        });
    });

    describe('getTaskById', () => {
        it('should return task when found', async () => {
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

            const result = await taskModel.getTaskById('test-id');

            expect(result).toEqual({
                id: 'test-id',
                title: 'Test Task',
                content: 'Test content',
                tags: ['test'],
                isPublic: false,
                isOverdue: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            });
        });

        it('should return null when task not found', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const result = await taskModel.getTaskById('non-existent');

            expect(result).toBeNull();
        });
    });

    describe('updateTask', () => {
        it('should update task successfully', async () => {
            const updateRequest: UpdateTaskRequest = {
                title: 'Updated Task',
                content: 'Updated content'
            };

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

            const result = await taskModel.updateTask('test-id', updateRequest);

            expect(result?.title).toBe('Updated Task');
            expect(result?.content).toBe('Updated content');
            expect(mockD1Database.run).toHaveBeenCalledTimes(1);
        });

        it('should return null when task not found', async () => {
            mockD1Database.first.mockResolvedValueOnce(null);

            const result = await taskModel.updateTask('non-existent', { title: 'New Title' });

            expect(result).toBeNull();
            expect(mockD1Database.run).not.toHaveBeenCalled();
        });
    });

    describe('deleteTask', () => {
        it('should delete task successfully', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const result = await taskModel.deleteTask('test-id');

            expect(result).toBe(true);
            expect(mockD1Database.prepare).toHaveBeenCalledWith('DELETE FROM tasks WHERE id = ?');
        });

        it('should return false when task not found', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 0 } });

            const result = await taskModel.deleteTask('non-existent');

            expect(result).toBe(false);
        });
    });

    describe('makeTaskPublic', () => {
        it('should make task public and return share ID', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 1 } });

            const shareId = await taskModel.makeTaskPublic('test-id');

            expect(shareId).toBeTruthy();
            expect(typeof shareId).toBe('string');
            expect(shareId?.length).toBe(12); // Shortened UUID
            expect(mockD1Database.run).toHaveBeenCalledTimes(1);
        });

        it('should return null when update fails', async () => {
            mockD1Database.run.mockResolvedValueOnce({ meta: { changes: 0 } });

            const shareId = await taskModel.makeTaskPublic('non-existent');

            expect(shareId).toBeNull();
        });
    });

    describe('getOverdueTasks', () => {
        it('should return overdue tasks', async () => {
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

            const result = await taskModel.getOverdueTasks();

            expect(result).toHaveLength(1);
            expect(result[0].isOverdue).toBe(true);
            expect(result[0].title).toBe('Overdue Task 1');
        });
    });
}); 