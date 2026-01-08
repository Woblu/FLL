import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { getVideoDetails } from '../utils/videoUtils.js';

export default function LevelCard({ level, index, listType }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const videoUrl = level.videoUrl || level.videoId;
  const levelName = level.name || level.levelName || '[Name Missing]';
  
  // --- THUMBNAIL LOGIC FIX ---
  // We check for the manually submitted thumbnailUrl first.
  // If it doesn't exist, THEN we call getVideoDetails for the fallback.
  let thumbnailUrl;
  if (level.thumbnailUrl) {
    thumbnailUrl = level.thumbnailUrl; // Use the manual URL (Imgur, Discord, etc.)
  } else {
    const videoDetails = getVideoDetails(videoUrl); // Get fallback (YouTube or placeholder)
    thumbnailUrl = videoDetails.thumbnailUrl;
  }
  // --- END OF FIX ---

  const handleClick = () => {
    const path = `/level/${listType}/${level.levelId || level.id}`;
    
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
      <div className="w-full sm:w-40 aspect-video rounded-md overflow-hidden flex-shrink-0 relative bg-gray-900">
        <img
          src={thumbnailUrl} // <-- This now uses our new logic
          alt={`${levelName} thumbnail`}
          className="w-full h-full object-cover"
          // Add error handling in case the manual link is broken
          onError={(e) => { e.target.src = 'https://i.imgur.com/K8x1g1U.png'; }}
        />
      </div>

      <div className="flex flex-col flex-grow text-center sm:text-left">
        <h2 className="font-bold text-xl text-gray-900 dark:text-text-primary">
          {level.placement ? `#${level.placement} - ` : ''}{levelName}
        </h2>
        
        <p className="text-gray-500 dark:text-text-secondary">
            {`${t('by')} ${level.creator}`}
        </p>
      </div>

    </div>
  );
}