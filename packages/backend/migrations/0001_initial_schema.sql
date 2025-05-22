-- Initial schema for Cosmo Notes application
-- Creates tasks table with all required fields from OpenAPI specification

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    dueDate TEXT, -- ISO 8601 datetime string
    tags TEXT, -- JSON array of strings
    isPublic INTEGER DEFAULT 0, -- SQLite boolean (0/1)
    isOverdue INTEGER DEFAULT 0, -- SQLite boolean (0/1)
    shareId TEXT UNIQUE, -- Public share identifier
    createdAt TEXT NOT NULL, -- ISO 8601 datetime string
    updatedAt TEXT NOT NULL, -- ISO 8601 datetime string
    userId TEXT -- For future user authentication
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
CREATE INDEX IF NOT EXISTS idx_tasks_isPublic ON tasks(isPublic);
CREATE INDEX IF NOT EXISTS idx_tasks_shareId ON tasks(shareId);
CREATE INDEX IF NOT EXISTS idx_tasks_userId ON tasks(userId);
CREATE INDEX IF NOT EXISTS idx_tasks_isOverdue ON tasks(isOverdue); 