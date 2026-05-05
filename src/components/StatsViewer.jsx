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

const VALID_LIST_TYPES = ['main', 'fll', 'hdl', 'unrated', 'platformer', 'challenge', 'speedhack', 'ddl', 'future', '10sll', 'ill'];

function isValidListType(value) {
  return typeof value === 'string' && VALID_LIST_TYPES.includes(value);
}

function toApiListName(listType) {
  if (listType === 'main' || listType === 'fll') return 'main-list';
  if (listType === 'hdl') return 'hdl-list';
  return `${listType}-list`;
}

// Old scoring system retained: base points by placement.
const getPoints = (placement) => {
  if (!Number.isFinite(placement) || placement < 1) return 0;
  return 100 / placement;
};

export default function StatsViewer({ onClose, listType, title }) {
  const [search, setSearch] = useState('');
  const [players, setPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const location = useLocation();
  const { t } = useLanguage();
  const isMountedRef = useRef(true);
  const searchInputRef = useRef(null);

  const normalizedListType = useMemo(() => {
    return isValidListType(listType) ? listType : 'fll';
  }, [listType]);

  const apiListName = useMemo(() => toApiListName(normalizedListType), [normalizedListType]);

  const sanitizedTitle = useMemo(() => {
    return typeof title === 'string' && title.trim() ? title.trim() : `${normalizedListType.toUpperCase()} Stats Viewer`;
  }, [title, normalizedListType]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlayers() {
      setIsLoadingPlayers(true);
      try {
        const [levelsRes, completionsRes] = await Promise.all([
          axios.get(`/api/lists/${apiListName}`),
          axios.get(`/api/completion-submissions/list-completions?list=${apiListName}`),
        ]);

        const levels = Array.isArray(levelsRes.data) ? levelsRes.data : [];
        const completionLevels = Array.isArray(completionsRes.data) ? completionsRes.data : [];

        const placementPoints = new Map(
          levels.map((level) => [Number(level?.placement), getPoints(Number(level?.placement))])
        );

        const completionsByPlayer = new Map();
        const verificationsByPlayer = new Map();

        for (const level of completionLevels) {
          const placement = Number(level?.placement);
          if (!Number.isFinite(placement) || placement < 1) continue;

          for (const record of level?.records || []) {
            const name = cleanUsername(record?.username);
            if (!name) continue;

            if (!completionsByPlayer.has(name)) {
              completionsByPlayer.set(name, new Set());
            }
            completionsByPlayer.get(name).add(placement);
          }
        }

        for (const level of levels) {
          const placement = Number(level?.placement);
          if (!Number.isFinite(placement) || placement < 1) continue;

          const verifier = cleanUsername(level?.verifier);
          if (!verifier) continue;

          if (!verificationsByPlayer.has(verifier)) {
            verificationsByPlayer.set(verifier, new Set());
          }
          verificationsByPlayer.get(verifier).add(placement);
        }

        const allPlayers = new Set([
          ...Array.from(completionsByPlayer.keys()),
          ...Array.from(verificationsByPlayer.keys()),
        ]);

        const ranked = Array.from(allPlayers).map((name) => {
          const completionPlacements = Array.from(completionsByPlayer.get(name) || []);
          const verificationPlacements = Array.from(verificationsByPlayer.get(name) || []);

          let score = 0;
          for (const placement of completionPlacements) {
            score += placementPoints.get(placement) || 0;
          }
          for (const placement of verificationPlacements) {
            score += (placementPoints.get(placement) || 0) * 1.1;
          }

          return {
            name,
            demonlistScore: score,
            completions: completionPlacements.length,
            verifications: verificationPlacements.length,
          };
        });

        ranked.sort((a, b) => b.demonlistScore - a.demonlistScore || a.name.localeCompare(b.name));

        const withRanks = ranked.map((player, index) => ({
          ...player,
          demonlistRank: index + 1,
        }));

        if (!cancelled) {
          setPlayers(withRanks);
        }
      } catch (error) {
        console.error('Failed to fetch stats viewer data:', error);
        if (!cancelled) {
          setPlayers([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPlayers(false);
        }
      }
    }

    fetchPlayers();

    return () => {
      cancelled = true;
    };
  }, [apiListName]);

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return players;

    return players.filter((player) => {
      const playerName = cleanUsername(player?.name).toLowerCase();
      return playerName.includes(query);
    });
  }, [players, search]);

  const handleSearchChange = useCallback((e) => {
    if (!isMountedRef.current) return;
    setSearch(String(e.target.value || '').slice(0, 100));
  }, []);

  const handleClose = useCallback(() => {
    if (!isMountedRef.current) return;
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && isMountedRef.current) {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

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

        <ul className="flex-grow overflow-y-auto custom-scrollbar space-y-2 p-4">
          {isLoadingPlayers ? (
            <li className="text-center text-text-muted py-8">{t('loading') || 'Loading...'}</li>
          ) : filteredPlayers.length === 0 ? (
            <li className="text-center text-text-muted py-8">{t('no_players_found') || 'No players found'}</li>
          ) : (
            filteredPlayers.map((player, index) => {
              const playerName = cleanUsername(player?.name) || 'Unknown';
              const playerSlug = playerName.toLowerCase().replace(/\s+/g, '-');
              const playerRank = Number.isFinite(player?.demonlistRank) ? player.demonlistRank : index + 1;
              const playerScore = Number.isFinite(player?.demonlistScore) ? player.demonlistScore : 0;

              return (
                <li
                  key={`${playerSlug}-${index}`}
                  className="flex items-center p-2 rounded-lg bg-primary-bg shadow-sm"
                >
                  <span className="font-bold text-lg text-accent w-10 text-left">#{playerRank}</span>
                  <Link
                    to={`/players/${normalizedListType}/${playerSlug}`}
                    state={{ from: location.pathname, listType: normalizedListType }}
                    className="flex-1 text-text-primary font-semibold text-left hover:underline"
                    onClick={handleClose}
                  >
                    {playerName}
                  </Link>
                  <span className="text-text-muted font-mono text-right">{playerScore.toFixed(2)}</span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
