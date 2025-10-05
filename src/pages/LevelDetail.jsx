import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { ChevronLeft, Copy } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const getYouTubeVideoId = (urlOrId) => {
  if (!urlOrId) return null;
  const urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
  const urlMatch = urlOrId.match(urlRegex);
  if (urlMatch && urlMatch[1]) { return urlMatch[1]; }
  return urlOrId.split('?')[0].split('&')[0];
};

export default function LevelDetail() {
  const { listType, levelId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [level, setLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCopied, setIsCopied] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  useEffect(() => {
    const fetchLevel = async () => {
      setIsLoading(true);
      setError('');
      try {
        // The API now expects the full list name, e.g., 'fll-list'
        const dbListName = `fll-list`;
        const response = await axios.get(`/api/level/${levelId}?list=${dbListName}`);
        
        if (response.data) {
          setLevel(response.data);
          setCurrentVideoId(getYouTubeVideoId(response.data.videoId));
        } else {
          throw new Error("Level not found on this list.");
        }
      } catch (err) {
        console.error("Failed to fetch level details:", err);
        setError("Failed to load level data. It might not exist on this list.");
        setLevel(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLevel();
  }, [levelId, listType]);

  const handleCopyClick = () => {
    if (level?.levelId) {
      navigator.clipboard.writeText(level.levelId).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Level Details..." />;
  }

  if (error || !level) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-500">{error || "Level Not Found"}</h1>
        <p className="text-gray-400">The level you're looking for doesn't exist in the list.</p>
        <button onClick={() => navigate('/')} className="mt-4 inline-flex items-center text-cyan-400 hover:underline">
          <ChevronLeft size={16} /> Go Back to List
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-gray-900 dark:text-gray-100">
      <div className="relative bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center mb-4 pt-8 sm:pt-0">
          <h1 className="font-poppins text-5xl font-bold text-cyan-600 dark:text-cyan-400 break-words">
            #{level.placement} - {level.name}
          </h1>
        </div>

        <div className="flex flex-wrap justify-center text-center mb-4 gap-x-8 gap-y-2">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold">Published by:</span> {level.creator}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold">Verified by:</span> {level.verifier}
          </p>
        </div>
        
        {level.levelId && (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <span className="font-bold">Level ID:</span>
              <button
                onClick={handleCopyClick}
                className="ml-2 px-2 py-1 rounded-md font-mono bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isCopied ? t('copied') : level.levelId}
              </button>
            </p>
          </div>
        )}

        {currentVideoId && (
          <div className="aspect-video w-full">
            <iframe
              key={currentVideoId}
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${currentVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-lg"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}