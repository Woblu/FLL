import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function ListManager() {
    const { token } = useAuth();
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Hardcoded to the single list for this site
    const listToManage = 'fll-list';

    const fetchLevels = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.get(`/api/lists/${listToManage}`);
            setLevels(res.data);
        } catch (err) {
            setError('Failed to fetch the level list.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

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
        // Prevent moving the top level further up
        if (newPlacement < 1) return;
        
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
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            {isLoading && <p className="animate-pulse text-center">Loading levels...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            {!isLoading && !error && (
                <div className="space-y-2">
                    {levels.map((level) => (
                        <div key={level.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-700/50 rounded-lg">
                            <span className="font-bold text-lg text-cyan-400 col-span-1">#{level.placement}</span>
                            <span className="col-span-5 truncate">{level.name}</span>
                            <span className="text-gray-400 col-span-3 truncate">by {level.creator}</span>
                            <div className="flex justify-end items-center gap-2 col-span-3">
                                <button onClick={() => handleMove(level.id, level.placement - 1)} className="p-1 hover:bg-gray-600 rounded-full" title="Move Up">
                                    <ChevronUp size={20} />
                                </button>
                                <button onClick={() => handleMove(level.id, level.placement + 1)} className="p-1 hover:bg-gray-600 rounded-full" title="Move Down">
                                    <ChevronDown size={20} />
                                </button>
                                <button onClick={() => handleRemove(level.id)} className="p-1 text-red-400 hover:bg-red-500/20 rounded-full" title="Remove Level">
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