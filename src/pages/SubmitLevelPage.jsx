import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloud } from 'lucide-react';

export default function SubmitLevelPage() {
  const { listType } = useParams(); // Get the list type from the URL (e.g., 'main' or 'hdl')
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
      // The payload now includes the correct list name
      await axios.post('/api/levels', 
        { levelName, levelId, videoId, list: `${listType}-list` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Level submitted to ${listType.toUpperCase()} successfully!`);
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
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Submit a {listType.toUpperCase()} Level</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Submit a level you have created and verified to add it to the {listType.toUpperCase()} list.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-ui-bg/50 p-6 rounded-xl border border-gray-200 dark:border-accent/30 space-y-6">
        <div>
          <label htmlFor="levelName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level Name</label>
          <input
            id="levelName"
            type="text"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="levelId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level ID</label>
          <input
            id="levelId"
            type="number"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="videoId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Video ID or URL (YouTube, Medal, etc.)</label>
          <input
            id="videoId"
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-b border-gray-200 dark:border-accent/50 py-4">
          <p><strong>Creator:</strong> {user?.username} (auto-filled)</p>
          <p><strong>Verifier:</strong> {user?.username} (auto-filled)</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          <UploadCloud size={18} />
          {isLoading ? 'Submitting...' : 'Submit Level'}
        </button>
      </form>
    </div>
  );
}