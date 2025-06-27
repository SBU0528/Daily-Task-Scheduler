import { Task, AIResponse } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getAISuggestion = async (tasks: Task[]): Promise<AIResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const incompleteTasks = tasks.filter(task => !task.completed);
  const taskSummary = incompleteTasks.map(task => ({
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate.toISOString().split('T')[0],
  }));

  const prompt = `Based on these tasks, what should I focus on today? Please provide a specific recommendation and brief reasoning.

Tasks:
${JSON.stringify(taskSummary, null, 2)}

Please respond in this exact JSON format:
{
  "suggestion": "Your specific recommendation here",
  "reasoning": "Brief explanation of why this is the best focus"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI suggestion');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No suggestion received');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback suggestion based on task analysis
    const highPriorityTasks = incompleteTasks.filter(task => task.priority === 'high');
    const overdueTasks = incompleteTasks.filter(task => new Date(task.dueDate) < new Date());
    
    if (overdueTasks.length > 0) {
      return {
        suggestion: `Focus on completing your overdue task: "${overdueTasks[0].title}"`,
        reasoning: 'Overdue tasks should be prioritized to prevent further delays.'
      };
    } else if (highPriorityTasks.length > 0) {
      return {
        suggestion: `Focus on your high-priority task: "${highPriorityTasks[0].title}"`,
        reasoning: 'High-priority tasks have the most impact on your goals.'
      };
    } else if (incompleteTasks.length > 0) {
      return {
        suggestion: `Start with: "${incompleteTasks[0].title}"`,
        reasoning: 'Beginning with your next scheduled task maintains good momentum.'
      };
    } else {
      return {
        suggestion: 'Great job! All your tasks are complete.',
        reasoning: 'Consider planning new tasks or take a well-deserved break.'
      };
    }
  }
};