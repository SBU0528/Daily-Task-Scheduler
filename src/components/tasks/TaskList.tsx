import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { Task } from '../../types';
import { Button } from '../ui/Button';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDueDateStatus = (dueDate: Date, completed: boolean) => {
    if (completed) return null;
    
    if (isPast(dueDate) && !isToday(dueDate)) {
      return { color: 'text-red-600', icon: AlertCircle, label: 'Overdue' };
    }
    
    if (isToday(dueDate)) {
      return { color: 'text-orange-600', icon: Clock, label: 'Due Today' };
    }
    
    return null;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-500 text-lg font-medium">No tasks yet</h3>
        <p className="text-gray-400 mt-1">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => {
          const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-200 ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => onToggleComplete(task.id, !task.completed)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-medium ${
                        task.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Due: {format(task.dueDate, 'MMM dd, yyyy')}</span>
                      {dueDateStatus && (
                        <div className={`flex items-center space-x-1 ${dueDateStatus.color}`}>
                          <dueDateStatus.icon className="w-4 h-4" />
                          <span className="font-medium">{dueDateStatus.label}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(task.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};