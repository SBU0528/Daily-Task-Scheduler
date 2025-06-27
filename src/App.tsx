import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { getAISuggestion } from './services/aiService';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { TaskList } from './components/tasks/TaskList';
import { TaskForm } from './components/tasks/TaskForm';
import { CalendarView } from './components/calendar/CalendarView';
import { AISuggestion } from './components/ai/AISuggestion';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Task, AIResponse } from './types';

const Dashboard: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [aiSuggestion, setAiSuggestion] = useState<AIResponse | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setShowTaskForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const handleAISuggestion = async () => {
    setLoadingAI(true);
    try {
      const suggestion = await getAISuggestion(tasks);
      setAiSuggestion(suggestion);
      setShowAISuggestion(true);
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header onAISuggestion={handleAISuggestion} loadingAI={loadingAI} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AISuggestion
          suggestion={aiSuggestion}
          isVisible={showAISuggestion}
          onClose={() => setShowAISuggestion(false)}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button
                  variant={view === 'list' ? 'primary' : 'ghost'}
                  onClick={() => setView('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  List View
                </Button>
                <Button
                  variant={view === 'calendar' ? 'primary' : 'ghost'}
                  onClick={() => setView('calendar')}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </div>

              <Button onClick={() => setShowTaskForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'list' ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                  <TaskList
                    tasks={tasks}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                  />
                </div>
              ) : (
                <CalendarView
                  tasks={tasks}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              )}
            </motion.div>
          </div>

          {view === 'calendar' && (
            <div className="lg:w-80">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Tasks for {selectedDate.toLocaleDateString()}
                </h3>
                <TaskList
                  tasks={tasks.filter(task => 
                    task.dueDate.toDateString() === selectedDate.toDateString()
                  )}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                />
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          title="Create New Task"
        >
          <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskForm(false)} />
        </Modal>

        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
        >
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </Modal>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? <Dashboard /> : <AuthForm />;
};

export default App;