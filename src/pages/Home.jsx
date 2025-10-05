import React, { useState } from "react";
import LevelCard from "../components/LevelCard";
import fllListData from '../data/fll-list.json'; // Import the static JSON data

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredLevels = fllListData.filter(level => {
    const searchTerm = search.toLowerCase();
    return (
      level.name.toLowerCase().includes(searchTerm) ||
      (level.creator && level.creator.toLowerCase().includes(searchTerm)) ||
      (level.verifier && level.verifier.toLowerCase().includes(searchTerm)) ||
      level.placement.toString().includes(searchTerm)
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
        {filteredLevels.length > 0 ? (
          filteredLevels.map((level) => (
            <LevelCard 
              key={level.levelId || level.name} 
              level={level} 
              listType="fll"
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No levels found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}