/**
 * @fileoverview Modal component displaying player statistics leaderboard with search functionality.
 * Shows ranked players for a specific list type with filtering capabilities.
 * 
 * @module StatsViewer
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { cleanUsername } from '../utils/scoring.js';
import axios from 'axios';

/**
 * Valid list types
 */
const VALID_LIST_TYPES = [
  'main',
  'unrated',
  'platformer',
  'challenge',
  'speedhack',
  'ddl',
  'future',
  '10sll',
  'ill'
];

/**
 * Validates list type
 * @param {string} listType - List type to validate
 * @returns {boolean} True if valid
 */
function isValidListType(listType) {
  return typeof listType === 'string' && VALID_LIST_TYPES.includes(listType);
}


/**
 * Stats viewer modal component
 * @param {object} props - Component props
 * @param {function} props.onClose - Callback to close modal
 * @param {string} props.listType - Type of list to display
 * @param {string} props.title - Modal title
 * @returns {JSX.Element} Stats viewer JSX
 */
export default function StatsViewer({ onClose, listType, title }) {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const { t } = useLanguage();
  const isMountedRef = useRef(true);
  const searchInputRef = useRef(null);

  // Validate and normalize list type
  const normalizedListType = useMemo(() => {
    return isValidListType(listType) ? listType : 'main';
  }, [listType]);

  // State for players data
  const [players, setPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  // Fetch players from API (database is source of truth)
  useEffect(() => {
    let isMounted = true;

    async function fetchPlayers() {
      setIsLoadingPlayers(true);
      try {
        const response = await axios.get(`/api/stats-viewer/${normalizedListType}`);
        if (isMounted) {
          setPlayers(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Failed to fetch stats viewer data:', error);
        if (isMounted) {
          setPlayers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlayers(false);
        }
      }
    }

    fetchPlayers();

    return () => {
      isMounted = false;
    };
  }, [normalizedListType]);

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!search || typeof search !== 'string') {
      return players;
    }

    const searchLower = search.toLowerCase().trim();
    if (searchLower.length === 0) {
      return players;
    }

    return players.filter((player) => {
      if (!player || typeof player !== 'object') return false;

     
      return playerName.includes(searchLower) || playerClan.includes(searchLower);
    });
  }, [players, search]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    if (isMountedRef.current) {
      const value = e.target.value;
      // Limit search length to prevent performance issues
      setSearch(value.substring(0, 100));
    }
  }, []);

  // Handle close with cleanup
  const handleClose = useCallback(() => {
    if (isMountedRef.current && onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && isMountedRef.current) {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-viewer-title"
    >
      <div
        className="stats-viewer-card bg-ui-bg rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-primary-bg flex justify-between items-center">
          <h2 id="stats-viewer-title" className="text-xl font-bold text-text-primary">
            {sanitizedTitle}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-text-primary hover:bg-primary-bg transition-colors"
            aria-label={t('close') || 'Close'}
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('search_player_placeholder') || 'Search players...'}
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 p-2 rounded-lg border border-primary-bg bg-primary-bg text-text-primary"
              aria-label={t('search_players') || 'Search players'}
            />
          </div>
        </div>

        {/* Player List */}
        <ul className="flex-grow overflow-y-auto custom-scrollbar space-y-2 p-4">
          {isLoadingPlayers ? (
            <li className="text-center text-text-muted py-8">
              {t('loading') || 'Loading...'}
            </li>
          ) : filteredPlayers.length === 0 ? (
            <li className="text-center text-text-muted py-8">
              {t('no_players_found') || 'No players found'}
            </li>
          ) : (
            filteredPlayers.map((player, index) => {
              if (!player || typeof player !== 'object') return null;

              const playerRank = typeof player.demonlistRank === 'number' ? player.demonlistRank : index + 1;
              const playerScore = typeof player.demonlistScore === 'number' ? player.demonlistScore : 0;

              return (
                <li
                  key={`${playerName}-${index}`}
                  className="flex items-center p-2 rounded-lg bg-primary-bg shadow-sm"
                >
                  <span className="font-bold text-lg text-accent w-10 text-left">
                    #{playerRank}
                  </span>
                  <Link
                    to={`/players/${normalizedListType}/${playerSlug}`}
                    state={{ from: location.pathname, listType: normalizedListType }}
                    className="flex-1 text-text-primary font-semibold text-left hover:underline"
                    onClick={handleClose}
                  >
                    {playerName}
                  </Link>
                  <span className="text-text-muted font-mono text-right">
                    {playerScore.toFixed(2)}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
