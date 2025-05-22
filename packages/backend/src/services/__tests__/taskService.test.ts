import { TaskService } from '../taskService';
import { TaskModel } from '../../db/models/task';
import { logger } from '../../lib/logger';

jest.mock('../../lib/logger');

const mockDb = {
    executeQuery: jest.fn(),
    executeQueryFirst: jest.fn(),
    executeQueryAll: jest.fn(),
};

describe('TaskService', () => {
    let service: TaskService;
    let model: TaskModel;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new TaskModel(mockDb as any);
        service = new TaskService(model);
    });

    it('creates a task and logs', async () => {
        const task = { id: '1', title: 'Test', isPublic: false, isOverdue: false, createdAt: '', updatedAt: '' };
        jest.spyOn(model, 'createTask').mockResolvedValue(task as any);
        await service.createTask({ title: 'Test' });
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('route=tasks method=POST action=create'), expect.any(Object));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('status=201'), expect.any(Object));
    });

    it('lists tasks and logs', async () => {
        jest.spyOn(model, 'getAllTasks').mockResolvedValue([]);
        await service.listTasks();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('route=tasks method=GET action=list'), expect.any(Object));
    });

    it('gets a task by id and logs', async () => {
        jest.spyOn(model, 'getTaskById').mockResolvedValue({ id: '1' } as any);
        await service.getTaskById('1');
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('route=tasks method=GET action=getById'), { id: '1' });
    });

    it('updates a task and logs', async () => {
        jest.spyOn(model, 'updateTask').mockResolvedValue({ id: '1' } as any);
        await service.updateTask('1', { title: 'New' });
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('route=tasks method=PUT action=update'), expect.objectContaining({ id: '1' }));
    });

    it('deletes a task and logs', async () => {
        jest.spyOn(model, 'deleteTask').mockResolvedValue(true);
        await service.deleteTask('1');
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('route=tasks method=DELETE action=delete'), { id: '1' });
    });
}); 