import React, { useState, useMemo, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

// Scoring formula: 100 points for #1, decaying for higher placements (worse rankings).
const getPoints = (placement) => 100 / placement;

export default function StatsViewer({ onClose, title, listType = "main" }) {
  const [search, setSearch] = useState('');
  const { token } = useAuth();
  const [completionData, setCompletionData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [isLoadingCompletions, setIsLoadingCompletions] = useState(false);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  // Fetch level data from database
  useEffect(() => {
    const fetchLevelData = async () => {
      setIsLoadingLevels(true);
      try {
        const response = await axios.get(`/api/lists/${listType}-list`);
        setLevelData(response.data);
      } catch (error) {
        console.error('Failed to fetch level data:', error);
      } finally {
        setIsLoadingLevels(false);
      }
    };

    fetchLevelData();
  }, [listType]);

  // Fetch completion data from database
  useEffect(() => {
    const fetchCompletionData = async () => {
      if (!token) return;
      
      setIsLoadingCompletions(true);
      try {
        const response = await axios.get('/api/completion-submissions/my-completions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletionData(response.data);
      } catch (error) {
        console.error('Failed to fetch completion data:', error);
      } finally {
        setIsLoadingCompletions(false);
      }
    };

    fetchCompletionData();
  }, [token]);

  const rankedPlayers = useMemo(() => {
    // 1. Create a map of placements to base points from the database level data
    const pointValues = new Map(levelData.map(level => [level.placement, getPoints(level.placement)]));

    // 2. Calculate verifications from database level data (verifier field)
    const verificationsByPlayer = {};
    levelData.forEach(level => {
      if (level.verifier) {
        if (!verificationsByPlayer[level.verifier]) {
          verificationsByPlayer[level.verifier] = [];
        }
        verificationsByPlayer[level.verifier].push(level.placement);
      }
    });

    // 3. Calculate completions from database completion data
    const completionsByPlayer = {};
    completionData.forEach(level => {
      level.records.forEach(record => {
        if (!completionsByPlayer[record.username]) {
          completionsByPlayer[record.username] = [];
        }
        if (!completionsByPlayer[record.username].includes(level.placement)) {
          completionsByPlayer[record.username].push(level.placement);
        }
      });
    });

    // 4. Get all unique players (from verifications and completions)
    const allPlayerNames = new Set([
      ...Object.keys(verificationsByPlayer),
      ...Object.keys(completionsByPlayer)
    ]);

    // 5. Create player data with correct stats
    const allPlayerData = Array.from(allPlayerNames).map(playerName => ({
      name: playerName,
      verifications: verificationsByPlayer[playerName] || [],
      completions: completionsByPlayer[playerName] || []
    }));

    // 6. Calculate the total score for each player with verifier bonuses
    const playersWithScores = allPlayerData.map(player => {
      let score = 0;
      
      // Points for completions (1x multiplier)
      score += player.completions.reduce((total, placement) => {
        return total + (pointValues.get(placement) || 0);
      }, 0);
      
      // Points for verifications (1.1x multiplier)
      score += player.verifications.reduce((total, placement) => {
        return total + (pointValues.get(placement) || 0) * 1.1;
      }, 0);
      
      return { ...player, score };
    });

    // 7. Sort players by score in descending order
    playersWithScores.sort((a, b) => b.score - a.score);

    // 8. Assign ranks
    return playersWithScores.map((player, index) => ({ ...player, rank: index + 1 }));
  }, [levelData, completionData]);

  const filteredPlayers = rankedPlayers.filter(
    (player) => player.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </header>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>
        <ul className="flex-grow overflow-y-auto custom-scrollbar space-y-2 p-4">
          {(isLoadingCompletions || isLoadingLevels) && (
            <li className="text-center text-gray-500 dark:text-gray-400 py-4">
              Loading stats data...
            </li>
          )}
          {filteredPlayers.map((player) => (
            <li key={player.name} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm">
              <span className="font-bold text-lg text-cyan-700 dark:text-cyan-400 w-10 text-left">
                #{player.rank}
              </span>
              <div className="flex-1 text-gray-900 dark:text-gray-100">
                <div className="font-semibold text-left">{player.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
                  <span>Completions: {player.completions?.length || 0}</span>
                  <span>Verifications: {player.verifications?.length || 0}</span>
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-mono text-right">
                {player.score.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}