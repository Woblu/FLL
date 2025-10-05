import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import LevelCard from "../components/LevelCard";
import LoadingSpinner from "../components/LoadingSpinner";
// Note: The static JSON import has been removed.

export default function Home() {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");

  // This function now fetches live data from your API
  const fetchLevels = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/lists/fll-list');
      setLevels(response.data);
    } catch (err) {
      console.error("Failed to fetch levels:", err);
      setError("Failed to load the list. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []); // This runs once when the component loads

  const filteredLevels = levels.filter(level => {
    const searchTerm = search.toLowerCase();
    return (
      level.name.toLowerCase().includes(searchTerm) ||
      level.placement.toString().includes(searchTerm) ||
      (level.creator && level.creator.toLowerCase().includes(searchTerm)) ||
      (level.verifier && level.verifier.toLowerCase().includes(searchTerm))
    );
  });
  
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 px-4">
      <div className="w-full max-w-3xl flex justify-center items-center mb-4 relative">
        <h1 className="font-poppins text-4xl font-bold text-center text-cyan-600 dark:text-cyan-400">
          FLL List
        </h1>
      </div>
      
      <div className="w-full max-w-3xl mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by Level Name, Placement, Creator, or Verifier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {isLoading ? (
          <LoadingSpinner message="Loading List..." />
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : filteredLevels.length > 0 ? (
          filteredLevels.map((level) => (
            <LevelCard 
              key={level.id || level.levelId} 
              level={level} 
              listType="fll"
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No levels found on the list.
          </p>
        )}
      </div>
    </div>
  );
}