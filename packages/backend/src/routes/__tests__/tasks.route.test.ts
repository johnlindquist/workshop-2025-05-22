import { Hono } from 'hono';
import { tasks } from '../tasks';
import { logger } from '../../lib/logger';

jest.mock('../../lib/logger');

describe('tasks route', () => {
    let app: Hono;

    beforeEach(() => {
        jest.clearAllMocks();
        app = new Hono();
        app.route('/api/v1/tasks', tasks);
    });

    it('returns 400 for missing title on create', async () => {
        const req = new Request('http://localhost/api/v1/tasks', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' },
        });
        const res = await app.request(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Validation failed');
    });

    // Add more tests for GET, POST, PUT, DELETE, 404, etc.
}); 