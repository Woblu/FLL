import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloud } from 'lucide-react';

export default function SubmitLevelPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [levelName, setLevelName] = useState('');
  const [levelId, setLevelId] = useState('');
  const [videoId, setVideoId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/levels', 
        { levelName, levelId, videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Level submitted successfully! It has been added to the bottom of the list.');
      // Clear form after a short delay
      setTimeout(() => {
        setLevelName('');
        setLevelId('');
        setVideoId('');
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-white p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Submit a Level</h1>
        <p className="text-gray-400 mt-2">Submit a level you have created and verified to add it to the list.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-6">
        <div>
          <label htmlFor="levelName" className="block text-sm font-bold text-gray-300 mb-2">Level Name</label>
          <input
            id="levelName"
            type="text"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="levelId" className="block text-sm font-bold text-gray-300 mb-2">Level ID</label>
          <input
            id="levelId"
            type="number"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="videoId" className="block text-sm font-bold text-gray-300 mb-2">Video ID or URL (YouTube, Medal, etc.)</label>
          <input
            id="videoId"
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200"
          />
        </div>

        <div className="text-sm text-gray-400 border-t border-b border-gray-700 py-4">
          <p><strong>Creator:</strong> {user?.username} (auto-filled)</p>
          <p><strong>Verifier:</strong> {user?.username} (auto-filled)</p>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <UploadCloud size={18} />
          {isLoading ? 'Submitting...' : 'Submit Level'}
        </button>
      </form>
    </div>
  );
}