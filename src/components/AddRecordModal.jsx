import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { X, Send } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function AddRecordModal({ levelId, onClose, onRecordAdded }) {
  const { token } = useAuth();
  const [percent, setPercent] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        '/api/records/create',
        {
          levelId: levelId,
          percent: parseInt(percent, 10),
          videoId: videoId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Success
      onRecordAdded(); // This will tell LevelDetail to re-fetch its data
      onClose(); // Close the modal
      
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-ui-bg/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-accent/30"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-accent/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Your Record</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent/30 transition-colors"
          >
            <X size={20} />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md text-center">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="percent" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Percentage
            </label>
            <input
              type="number"
              id="percent"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              required
              min="1"
              max="100"
              disabled={isLoading}
              className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/50 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-accent"
              placeholder="e.g., 100"
            />
          </div>
          
          <div>
            <label htmlFor="videoId" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Video Proof (YouTube, Drive, etc.)
            </label>
            <input
              type="text"
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              required
              disabled={isLoading}
              className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/50 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-accent"
              placeholder="https.youtube.com/..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-accent dark:to-brand-cyan dark:hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size={20} /> : <Send size={18} />}
            {isLoading ? 'Submitting...' : 'Submit Record'}
          </button>
        </form>
      </div>
    </div>
  );
}