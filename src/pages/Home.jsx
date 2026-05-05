import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import LevelCard from "../components/LevelCard";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner";

const listTitles = {
  main: "FLL List",
  fll: "FLL List",
  unrated: "Unrated List",
  platformer: "Platformer List",
  speedhack: "Speedhack List",
  future: "Future List",
  challenge: "Challenge List",
  scl: "SCL",
  ddl: "DDL",
  hdl: "HDL (Hardest Demons List)",
};

export default function Home() {
  const location = useLocation();
  const { t } = useLanguage();
  const { token } = useAuth();
  const currentListType = location.pathname.substring(1) || "main";
  
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  
  const fetchLevels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/lists/${currentListType}-list`);
      setLevels(response.data);
    } catch (err) {
      console.error("Failed to fetch levels:", err);
      setError(`Failed to load '${listTitles[currentListType]}'. Please try again later.`);
      setLevels([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLevels();
  }, [currentListType, token]);

  useEffect(() => {
    const handleFocus = () => {
      fetchLevels();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentListType]);
  
  const filteredLevels = levels.filter(level => {
    const searchTerm = search.toLowerCase();
    const nameMatch = level.name && level.name.toLowerCase().includes(searchTerm);
    const placementMatch = level.placement && level.placement.toString().includes(searchTerm);
    const creatorMatch = level.creator && level.creator.toLowerCase().includes(searchTerm);
    const verifierMatch = level.verifier && level.verifier.toLowerCase().includes(searchTerm);

    return nameMatch || placementMatch || creatorMatch || verifierMatch;
  });
  
  return (
    <>
      <div className="flex flex-col items-center pt-6 px-4">
        <div className="w-full max-w-4xl flex justify-center items-center mb-4 relative">
          <h1 className="font-poppins text-5xl font-bold text-center capitalize break-words text-gray-900 dark:text-white">
            {listTitles[currentListType]}
          </h1>
        </div>

        <div className="w-full max-w-4xl mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search by Level Name, Placement, Creator, or Verifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-3 rounded-lg border bg-gray-50 dark:bg-ui-bg/50 border-gray-300 dark:border-accent/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {isLoading ? (
            <LoadingSpinner message="Loading List..." />
          ) : error ? (
            <p className="text-center mt-8 text-red-600 dark:text-red-500">{error}</p>
          ) : filteredLevels.length > 0 ? (
            filteredLevels.map((level, index) => (
              <LevelCard 
                key={level.id || level.levelId || index} 
                level={level} 
                listType={currentListType}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              {t('no_levels_found')}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
