import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle, X } from 'lucide-react';

export default function SubmitLevelPage() {
  const { listType } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [levelName, setLevelName] = useState('');
  const [levelId, setLevelId] = useState('');
  const [videoId, setVideoId] = useState('');
  const [attempts, setAttempts] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be smaller than 4MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.json();
      setThumbnailUrl(blob.url);
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError('Failed to upload image to Vercel.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/levels', 
        { 
          levelName, 
          levelId, 
          videoId, 
          attempts, 
          thumbnailUrl,
          list: `${listType}-list` 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Level submitted to ${listType.toUpperCase()} successfully!`);
      setTimeout(() => {
        setLevelName('');
        setLevelId('');
        setVideoId('');
        setAttempts('');
        setThumbnailUrl('');
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
        <p className="text-gray-500 dark:text-gray-400 mt-2">Add your level to the list with a custom thumbnail.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-ui-bg/50 p-6 rounded-xl border border-gray-200 dark:border-accent/30 space-y-6 shadow-xl">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level Name</label>
            <input type="text" value={levelName} onChange={(e) => setLevelName(e.target.value)} required className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level ID</label>
            <input type="number" value={levelId} onChange={(e) => setLevelId(e.target.value)} required className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Video Proof</label>
          <input type="text" value={videoId} onChange={(e) => setVideoId(e.target.value)} required placeholder="YouTube/Medal Link" className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white" />
        </div>

        {/* Thumbnail Section */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Thumbnail Image</label>
          
          <div className="relative group">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Paste image URL or upload..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full pl-10 pr-24 py-2 rounded-lg border bg-gray-50 dark:bg-ui-bg/30 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="absolute inset-y-1 right-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    className="h-full px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-2 disabled:bg-gray-500"
                  >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </div>

          {thumbnailUrl && (
            <div className="relative mt-2 rounded-lg overflow-hidden border-2 border-indigo-500/30 group aspect-video bg-black">
              <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setThumbnailUrl('')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                <CheckCircle size={10} className="text-green-400" /> Preview Active
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-white/5 rounded-lg italic">
          Submitting as <strong>{user?.username}</strong>. Ensure all links are public.
        </div>

        {error && <p className="text-red-500 text-sm font-medium text-center animate-pulse">{error}</p>}
        {success && <p className="text-green-500 text-sm font-medium text-center">{success}</p>}

        <button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
          {isLoading ? 'Processing...' : 'Submit Level to List'}
        </button>
      </form>
    </div>
  );
}