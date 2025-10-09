import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { Pencil, Trash2, Pin, PinOff } from 'lucide-react';

const getYouTubeVideoId = (urlOrId) => {
  if (!urlOrId) return null;
  const urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
  const urlMatch = urlOrId.match(urlRegex);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].substring(0, 11);
  }
  if (typeof urlOrId === 'string' && urlOrId.length >= 11) {
     return urlOrId.substring(0, 11);
  }
  return null;
};

export default function LevelCard({ level, index, listType, onEdit, onDelete, onPin, pinnedRecordId }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isPinned = level.id === pinnedRecordId;

  const videoUrl = level.videoUrl || level.videoId;
  const levelName = level.name || level.levelName || '[Name Missing]';
  const videoId = getYouTubeVideoId(videoUrl);
  
  let thumbnailUrl = level.thumbnail || level.thumbnailUrl;
  if (!thumbnailUrl && videoId) {
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  const handleClick = () => {
    let path;
    if (listType === 'progression') {
      path = `/progression/${level.id}`;
    } else {
      // --- THIS LINE IS FIXED ---
      // It now uses the dynamic 'listType' prop instead of the hardcoded 'fll'
      path = `/level/${listType}/${level.levelId || level.id}`;
    }
    
    if (level.id || level.levelId) {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer
        transition-all transform hover:-translate-y-1 hover:shadow-2xl 
        bg-white border border-gray-200 hover:ring-2 hover:ring-indigo-400
        dark:bg-ui-bg/50 dark:border-accent/30 dark:hover:ring-accent`}
    >
      <div className="w-full sm:w-40 aspect-video rounded-md overflow-hidden flex-shrink-0 relative">
        <img
          src={thumbnailUrl || 'https://placehold.co/320x180/e2e8f0/334155?text=No+Preview'}
          alt={`${levelName} thumbnail`}
          className="w-full h-full object-cover"
        />
        {isPinned && listType === 'progression' && (
          <div className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full">
            <Pin size={12} className="text-gray-900"/>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow text-center sm:text-left">
        <h2 className="font-bold text-xl text-gray-900 dark:text-text-primary">
          {level.placement ? `#${level.placement} - ` : ''}{levelName}
        </h2>
        
        <p className="text-gray-500 dark:text-text-secondary">
            {`${t('by')} ${level.creator}`}
        </p>
      </div>

      {listType === 'progression' && (
        <div className="flex flex-col sm:flex-row gap-1 z-10">
          {onPin && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onPin(isPinned ? null : level.id); }} 
              className={`p-2 rounded-full ${isPinned ? 'text-yellow-400 bg-yellow-500/20' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20'}`}
              title={isPinned ? "Unpin Record" : "Pin Record"}
            >
              {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
            </button>
          )}
          {onEdit && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onEdit(level); }} 
              className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20 rounded-full"
              title="Edit Record"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onDelete(level.id); }} 
              className="p-2 text-red-500 hover:bg-red-500/20 rounded-full"
              title="Delete Record"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}