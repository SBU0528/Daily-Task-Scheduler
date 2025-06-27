import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target } from 'lucide-react';
import { AIResponse } from '../../types';

interface AISuggestionProps {
  suggestion: AIResponse | null;
  isVisible: boolean;
  onClose: () => void;
}

export const AISuggestion: React.FC<AISuggestionProps> = ({
  suggestion,
  isVisible,
  onClose,
}) => {
  if (!isVisible || !suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-6"
    >
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Suggestion</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">Focus Recommendation</span>
              </div>
              <p className="text-gray-700">{suggestion.suggestion}</p>
            </div>
            
            {suggestion.reasoning && (
              <div className="bg-white/40 rounded-lg p-4">
                <span className="font-medium text-gray-900 block mb-2">Reasoning</span>
                <p className="text-gray-600 text-sm">{suggestion.reasoning}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm mt-4 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
};