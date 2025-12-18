import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, UploadCloud, Loader2, Link as LinkIcon, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SubmissionForm() {
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);
  
  const [playerName, setPlayerName] = useState(user.username);
  const [levelName, setLevelName] = useState('');
  const [percent, setPercent] = useState(100);
  const [videoId, setVideoId] = useState('');
  const [rawFootageLink, setRawFootageLink] = useState('');
  const [notes, setNotes] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPlayerName(user.username);
  }, [user.username]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for proof files
      setError('Proof file must be smaller than 10MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.json();
      setRawFootageLink(blob.url);
      setSuccess('Proof uploaded successfully!');
    } catch (err) {
      setError('Failed to upload proof to Vercel.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/submissions/create', {
        levelName,
        player: playerName,
        percent: Number(percent),
        videoId,
        rawFootageLink,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(response.data.message);
      
      // Reset form
      setLevelName('');
      setPercent(100);
      setVideoId('');
      setRawFootageLink('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-center text-sm font-medium animate-pulse">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-xl text-center text-sm font-medium">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="levelName" className="block text-sm font-bold text-gray-300 mb-2">Demon Name</label>
          <input type="text" id="levelName" value={levelName} onChange={(e) => setLevelName(e.target.value)} required disabled={isSubmitting} placeholder="e.g. Bloodbath" className="w-full p-2.5 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
        </div>

        <div>
          <label htmlFor="player" className="block text-sm font-bold text-gray-300 mb-2">Record Holder</label>
          <input 
            type="text" 
            id="player" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={user.role !== 'ADMIN' && user.role !== 'MODERATOR'}
            className="w-full p-2.5 rounded-xl border border-white/10 bg-black/40 text-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none disabled:cursor-not-allowed" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="percent" className="block text-sm font-bold text-gray-300 mb-2">Progress (%)</label>
          <input type="number" id="percent" value={percent} onChange={(e) => setPercent(e.target.value)} required min="1" max="100" disabled={isSubmitting} className="w-full p-2.5 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
        </div>

        <div>
          <label htmlFor="videoId" className="block text-sm font-bold text-gray-300 mb-2">Video Proof URL</label>
          <input type="text" id="videoId" value={videoId} onChange={(e) => setVideoId(e.target.value)} required placeholder="YouTube/Twitch Link" disabled={isSubmitting} className="w-full p-2.5 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
        </div>
      </div>
      
      {/* Raw Footage / Proof Upload Section */}
      <div className="space-y-2">
        <label htmlFor="rawFootageLink" className="block text-sm font-bold text-gray-300">Raw Footage / Additional Proof</label>
        <p className="text-xs text-gray-500 mb-2">Required for all submissions. Upload a file or provide a cloud link.</p>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            id="rawFootageLink"
            placeholder="Google Drive link or upload file..."
            value={rawFootageLink}
            onChange={(e) => setRawFootageLink(e.target.value)}
            required
            className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          />
          <div className="absolute inset-y-1.5 right-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading || isSubmitting}
              className="h-full px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 disabled:bg-gray-700 shadow-lg"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {isUploading ? 'Uploading...' : 'Upload Proof'}
            </button>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        
        {rawFootageLink && rawFootageLink.includes('public.blob.vercel-storage.com') && (
          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 w-fit">
            <CheckCircle size={12} /> File verified and ready for review
            <button type="button" onClick={() => setRawFootageLink('')} className="ml-2 hover:text-white"><X size={12}/></button>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-gray-300 mb-2">Moderator Notes</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" placeholder="Any details for the list team..." disabled={isSubmitting} className="w-full p-3 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting || isUploading} 
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl shadow-cyan-900/20 active:scale-[0.98]"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />} 
        {isSubmitting ? 'Submitting Record...' : 'Submit for Review'}
      </button>

      <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest">
        Submissions are manually verified by list moderators
      </p>
    </form>
  );
}