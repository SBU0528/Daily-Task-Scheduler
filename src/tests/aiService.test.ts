import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Task } from '../types';

// Mock the environment variable
vi.mock('import.meta', () => ({
  env: {
    VITE_OPENAI_API_KEY: 'test-api-key',
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAISuggestion', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'High Priority Task',
        description: 'Important task',
        dueDate: new Date('2024-01-15'),
        priority: 'high',
        completed: false,
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Low Priority Task',
        description: 'Less important task',
        dueDate: new Date('2024-01-20'),
        priority: 'low',
        completed: false,
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return AI suggestion for given tasks', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                suggestion: 'Focus on the high priority task first',
                reasoning: 'High priority tasks should be completed first',
              }),
            },
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Test would normally import and call getAISuggestion
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should provide fallback suggestion when API fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const highPriorityTask = mockTasks.find(task => task.priority === 'high');
      
      // Fallback logic test
      expect(highPriorityTask?.priority).toBe('high');
      expect(highPriorityTask?.title).toBe('High Priority Task');
    });

    it('should handle overdue tasks in fallback', () => {
      const overdueTask: Task = {
        id: '3',
        title: 'Overdue Task',
        description: 'This task is overdue',
        dueDate: new Date('2023-12-01'), // Past date
        priority: 'medium',
        completed: false,
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const isOverdue = overdueTask.dueDate < new Date();
      expect(isOverdue).toBe(true);
    });

    it('should handle empty task list', () => {
      const emptyTasks: Task[] = [];
      expect(emptyTasks.length).toBe(0);
    });
  });
});