// API client for Cosmo Notes backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface Task {
    id: string;
    title: string;
    content?: string;
    dueDate?: string; // ISO 8601 datetime string
    tags?: string[]; // Array of strings
    isPublic: boolean;
    isOverdue: boolean;
    shareId?: string;
    createdAt: string; // ISO 8601 datetime string
    updatedAt: string; // ISO 8601 datetime string
    userId?: string;
}

export interface CreateTaskRequest {
    title: string;
    content?: string;
    dueDate?: string;
    tags?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    content?: string;
    dueDate?: string;
    tags?: string[];
    isPublic?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
}

export interface ShareResponse {
    shareId: string;
    shareUrl: string;
    isPublic: boolean;
}

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Task CRUD operations
    async getTasks(filters?: {
        tag?: string;
        overdue?: boolean;
        public?: boolean;
        userId?: string;
    }): Promise<ApiResponse<Task[]>> {
        const params = new URLSearchParams();
        if (filters?.tag) params.append('tag', filters.tag);
        if (filters?.overdue !== undefined) params.append('overdue', filters.overdue.toString());
        if (filters?.public !== undefined) params.append('public', filters.public.toString());
        if (filters?.userId) params.append('userId', filters.userId);

        const queryString = params.toString();
        const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

        return this.request<Task[]>(endpoint);
    }

    async getTask(id: string): Promise<ApiResponse<Task>> {
        return this.request<Task>(`/tasks/${id}`);
    }

    async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
        return this.request<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
        return this.request<Task>(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTask(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }

    // Task sharing operations
    async shareTask(id: string): Promise<ApiResponse<ShareResponse>> {
        return this.request<ShareResponse>(`/tasks/${id}/share`, {
            method: 'POST',
        });
    }

    async unshareTask(id: string): Promise<ApiResponse<{ isPublic: boolean }>> {
        return this.request<{ isPublic: boolean }>(`/tasks/${id}/share`, {
            method: 'DELETE',
        });
    }

    async getSharedTask(shareId: string): Promise<ApiResponse<Task>> {
        return this.request<Task>(`/shared/${shareId}`);
    }

    // Overdue task operations
    async getOverdueTasks(userId?: string): Promise<ApiResponse<Task[]>> {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const queryString = params.toString();
        const endpoint = `/notifications/overdue${queryString ? `?${queryString}` : ''}`;

        return this.request<Task[]>(endpoint);
    }

    async updateOverdueStatus(): Promise<ApiResponse<{
        updatedCount: number;
        overdueTasksCount: number;
    }>> {
        return this.request(`/notifications/overdue/update`, {
            method: 'POST',
        });
    }

    async sendOverdueNotifications(userId?: string): Promise<ApiResponse<{
        notificationsSent: number;
    }>> {
        return this.request(`/notifications/overdue/send`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
    }
}

export const apiClient = new ApiClient();

// Utility functions for task management
export const taskUtils = {
    isOverdue: (task: Task): boolean => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < new Date();
    },

    formatDueDate: (dueDate: string): string => {
        const date = new Date(dueDate);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Overdue by ${Math.abs(diffDays)} day(s)`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else {
            return `Due in ${diffDays} day(s)`;
        }
    },

    getTaskColor: (task: Task): string => {
        if (task.isOverdue) {
            return 'bg-gradient-to-br from-red-400 to-red-300';
        }

        // Cycle through colors based on task ID
        const colors = [
            'bg-gradient-to-br from-cyan-400 to-cyan-300',
            'bg-gradient-to-br from-pink-400 to-pink-300',
            'bg-gradient-to-br from-yellow-400 to-yellow-300',
            'bg-gradient-to-br from-purple-400 to-purple-300',
            'bg-gradient-to-br from-green-400 to-green-300',
            'bg-gradient-to-br from-orange-400 to-orange-300',
        ];

        const index = task.id.charCodeAt(0) % colors.length;
        return colors[index];
    },

    generateShareUrl: (shareId: string): string => {
        const baseUrl = typeof window !== 'undefined'
            ? window.location.origin
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/shared/${shareId}`;
    },
}; 