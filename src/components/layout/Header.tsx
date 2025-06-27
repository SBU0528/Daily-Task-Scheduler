import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onAISuggestion: () => void;
  loadingAI: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAISuggestion, loadingAI }) => {
  const { currentUser, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Task Scheduler</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onAISuggestion}
              loading={loadingAI}
              className="hidden sm:flex"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestion
            </Button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUser?.displayName || currentUser?.email}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={logout}
                size="sm"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};