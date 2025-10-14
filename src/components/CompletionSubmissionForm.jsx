import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CompletionSubmissionForm({ level, onClose }) {
  const { user, token } = useAuth();
  
  const [playerName, setPlayerName] = useState(user.username);
  const [percent, setPercent] = useState(100);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the playerName state in sync if the user object changes
  useEffect(() => {
    setPlayerName(user.username);
  }, [user.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/completion-submissions/create', {
        levelId: level.id,
        levelName: level.name,
        placement: level.placement,
        player: playerName,
        percent: Number(percent),
        videoUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(response.data.message);
      // Close form after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Submit Completion</h3>
      </div>
      
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-300 mb-1">Level:</p>
        <p className="font-semibold text-white">#{level.placement} - {level.name}</p>
        <p className="text-sm text-gray-400">Created by {level.creator}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md text-center">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="player" className="block text-sm font-bold text-gray-200 mb-1">
            Player Name
          </label>
          <p className="text-xs text-gray-400 mb-2">
            The player who completed the level. This defaults to your username.
          </p>
          <input 
            type="text" 
            id="player" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={user.role !== 'ADMIN' && user.role !== 'MODERATOR'}
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed" 
          />
        </div>

        <div>
          <label htmlFor="percent" className="block text-sm font-bold text-gray-200 mb-1">
            Completion Percentage
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Must be 100% for a completion submission.
          </p>
          <input 
            type="number" 
            id="percent" 
            value={percent} 
            onChange={(e) => setPercent(e.target.value)} 
            required 
            min="100" 
            max="100" 
            disabled={isSubmitting} 
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
          />
        </div>

        <div>
          <label htmlFor="videoUrl" className="block text-sm font-bold text-gray-200 mb-1">
            Video Proof
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Link to YouTube video or Google Drive showing your completion.
          </p>
          <input 
            type="url" 
            id="videoUrl" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            required 
            disabled={isSubmitting} 
            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" /> 
            {isSubmitting ? 'Submitting...' : 'Submit Completion'}
          </button>
          
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          By submitting, you confirm this is your own completion of the level.
        </p>
      </form>
    </div>
  );
}
