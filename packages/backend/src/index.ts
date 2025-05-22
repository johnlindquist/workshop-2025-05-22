import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { databaseMiddleware } from './middleware/database'
import { loggingMiddleware } from './middleware/logging'
import { tasks } from './routes/tasks'
import { sharing } from './routes/sharing'
import { notifications } from './routes/notifications'
import { Env } from './db/connection'

const app = new Hono<{ Bindings: Env }>()

// Global CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Global logging middleware
app.use('*', loggingMiddleware)

// Database middleware for D1 binding
app.use('*', databaseMiddleware)

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Cosmo Notes API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API routes
app.route('/api/v1/tasks', tasks)
app.route('/api/v1/tasks', sharing)
app.route('/api/v1/notifications', notifications)
app.route('/api/v1', sharing) // For /api/v1/shared/:shareId endpoint

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  }, 500)
})

const port = 3001
console.log(`🚀 Cosmo Notes API server starting on port ${port}`)

serve({
  fetch: app.fetch,
  port: port,
})

export default app
