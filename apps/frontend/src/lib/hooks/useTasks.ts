'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Task, CreateTaskRequest, UpdateTaskRequest } from '../api';

interface UseTasksOptions {
    filters?: {
        tag?: string;
        overdue?: boolean;
        public?: boolean;
        userId?: string;
    };
    autoRefresh?: boolean;
    refreshInterval?: number;
}

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (data: CreateTaskRequest) => Promise<Task | null>;
    updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
    deleteTask: (id: string) => Promise<boolean>;
    shareTask: (id: string) => Promise<string | null>;
    unshareTask: (id: string) => Promise<boolean>;
    refreshTasks: () => Promise<void>;
    clearError: () => void;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
    const { filters, autoRefresh = false, refreshInterval = 30000 } = options;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTasks = useCallback(async () => {
        try {
            setError(null);
            const response = await apiClient.getTasks(filters);

            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                throw new Error(response.error || 'Failed to fetch tasks');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
        try {
            setError(null);
            const response = await apiClient.createTask(data);

            if (response.success && response.data) {
                setTasks(prev => [response.data!, ...prev]);
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to create task');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
            setError(errorMessage);
            console.error('Failed to create task:', err);
            return null;
        }
    }, []);

    const updateTask = useCallback(async (id: string, data: UpdateTaskRequest): Promise<Task | null> => {
        try {
            setError(null);
            const response = await apiClient.updateTask(id, data);

            if (response.success && response.data) {
                setTasks(prev => prev.map(task =>
                    task.id === id ? response.data! : task
                ));
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to update task');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
            setError(errorMessage);
            console.error('Failed to update task:', err);
            return null;
        }
    }, []);

    const deleteTask = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const response = await apiClient.deleteTask(id);

            if (response.success) {
                setTasks(prev => prev.filter(task => task.id !== id));
                return true;
            } else {
                throw new Error(response.error || 'Failed to delete task');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
            setError(errorMessage);
            console.error('Failed to delete task:', err);
            return false;
        }
    }, []);

    const shareTask = useCallback(async (id: string): Promise<string | null> => {
        try {
            setError(null);
            const response = await apiClient.shareTask(id);

            if (response.success && response.data) {
                // Update the task in local state
                setTasks(prev => prev.map(task =>
                    task.id === id ? { ...task, isPublic: true, shareId: response.data!.shareId } : task
                ));
                return response.data.shareUrl;
            } else {
                throw new Error(response.error || 'Failed to share task');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to share task';
            setError(errorMessage);
            console.error('Failed to share task:', err);
            return null;
        }
    }, []);

    const unshareTask = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const response = await apiClient.unshareTask(id);

            if (response.success) {
                // Update the task in local state
                setTasks(prev => prev.map(task =>
                    task.id === id ? { ...task, isPublic: false, shareId: undefined } : task
                ));
                return true;
            } else {
                throw new Error(response.error || 'Failed to unshare task');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to unshare task';
            setError(errorMessage);
            console.error('Failed to unshare task:', err);
            return false;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initial load
    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(refreshTasks, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, refreshTasks]);

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        shareTask,
        unshareTask,
        refreshTasks,
        clearError,
    };
} 