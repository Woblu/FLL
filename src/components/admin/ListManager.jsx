import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

// Accept 'listToManage' as a prop
export default function ListManager({ listToManage }) {
    const { token } = useAuth();
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // REMOVED: Hardcoded list name

    const fetchLevels = async () => {
        if (!listToManage) return; // Don't fetch if no list is selected
        setIsLoading(true);
        setError('');
        try {
            // Use the 'listToManage' prop to fetch the correct list
            const res = await axios.get(`/api/lists/${listToManage}`);
            setLevels(res.data);
        } catch (err) {
            setError(`Failed to fetch the '${listToManage}' list.`);
        } finally {
            setIsLoading(false);
        }
    };

    // This effect fetches data when the component first loads
    // AND when the 'listToManage' prop changes
    useEffect(() => {
        fetchLevels();
    }, [listToManage]); // Add listToManage as a dependency

    // This effect re-fetches data whenever the user returns to the tab
    useEffect(() => {
        const handleFocus = () => fetchLevels();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [listToManage]); // Also add listToManage here

    const handleRemove = async (levelId) => {
        if (!window.confirm("Are you sure you want to remove this level?")) return;
        try {
            await axios.delete('/api/admin/remove-level', {
                headers: { Authorization: `Bearer ${token}` },
                data: { levelId }
            });
            fetchLevels(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove level.');
        }
    };
    
    const handleMove = async (levelId, newPlacement) => {
        // Prevent moving the top item further up
        if (newPlacement < 1) return;
        // Prevent moving the bottom item further down
        if (newPlacement > levels.length) return;
        
        try {
            await axios.put('/api/admin/move-level', 
                { levelId, newPlacement },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLevels(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to move level.');
        }
    };

    return (
        <div className="bg-white dark:bg-ui-bg/50 p-6 rounded-xl border border-gray-200 dark:border-accent/30">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Managing: {listToManage}
            </h2>
            {isLoading && <p className="animate-pulse text-center text-gray-700 dark:text-gray-300">Loading levels...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            {!isLoading && !error && levels.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No levels found on this list.</p>
            )}

            {!isLoading && !error && levels.length > 0 && (
                <div className="space-y-2">
                    {levels.map((level) => (
                        <div key={level.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-50 dark:bg-ui-bg/30 rounded-lg">
                            <span className="font-bold text-lg text-indigo-500 dark:text-cyan-400 col-span-1">#{level.placement}</span>
                            <span className="col-span-5 truncate text-gray-800 dark:text-text-primary">{level.name}</span>
                            <span className="text-gray-500 dark:text-text-secondary col-span-3 truncate">by {level.creator}</span>
                            <div className="flex justify-end items-center gap-2 col-span-3 text-gray-600 dark:text-gray-300">
                                <button 
                                    onClick={() => handleMove(level.id, level.placement - 1)} 
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full disabled:opacity-20" 
                                    title="Move Up"
                                    disabled={level.placement === 1}
                                >
                                    <ChevronUp size={20} />
                                </button>
                                <button 
                                    onClick={() => handleMove(level.id, level.placement + 1)} 
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full disabled:opacity-20" 
                                    title="Move Down"
                                    disabled={level.placement === levels.length}
                                >
                                    <ChevronDown size={20} />
                                </button>
                                <button 
                                    onClick={() => handleRemove(level.id)} 
                                    className="p-1 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-full" 
                                    title="Remove Level"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}