import { Context, Next } from 'hono';

export const loggingMiddleware = async (c: Context, next: Next) => {
    const startTime = Date.now();
    const method = c.req.method;
    const url = c.req.url;

    console.log(JSON.stringify({
        level: 'INFO',
        message: 'Request started',
        timestamp: new Date().toISOString(),
        method,
        url
    }));

    await next();

    const duration = Date.now() - startTime;
    const status = c.res.status;

    console.log(JSON.stringify({
        level: 'INFO',
        message: 'Request completed',
        timestamp: new Date().toISOString(),
        method,
        url,
        status,
        duration: `${duration}ms`
    }));
}; 