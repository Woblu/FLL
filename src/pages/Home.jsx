import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import LevelCard from "../components/LevelCard";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import AddPersonalRecordForm from "../components/AddPersonalRecordForm";
import { PlusCircle, History, X } from 'lucide-react';
import LoadingSpinner from "../components/LoadingSpinner";

const listTitles = {
  main: "Main List", unrated: "Unrated List", platformer: "Platformer List",
  speedhack: "Speedhack List", future: "Future List", challenge: "Challenge List",
  progression: "Progression Tracker"
};

const HistoryModal = ({ onClose, onFetchHistory }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onFetchHistory(date);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gd-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="bg-gd-black/80 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-sm border-2 border-gd-pink" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-gd-purple flex justify-between items-center">
                    <h2 className="text-xl font-bold">View List History</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gd-purple/60 transition-colors"><X size={20}/></button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-300 text-shadow-none">
                        For simplicity, list history only started on <strong>October 4, 2025,</strong> and only works for the main list.
                    </p>
                    <div>
                        <label className="block text-sm font-bold mb-2">Select a Date</label>
                        <input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gd-purple bg-gd-black/50 text-white focus:outline-none focus:ring-2 focus:ring-gd-pink focus:border-gd-pink text-shadow-none"
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-gd-pink to-cyan-500 text-white hover:opacity-90 transition-all hover:scale-105 text-shadow-none">View History</button>
                </form>
            </div>
        </div>
    );
};

export default function Home() {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const currentListType = location.pathname.startsWith('/progression') ? 'progression' : (location.pathname.substring(1) || "main");
  
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [historicDate, setHistoricDate] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [pinnedRecordId, setPinnedRecordId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);

  useEffect(() => {
    if (user) setPinnedRecordId(user.pinnedRecordId);
  }, [user]);

  const fetchLevels = async (isHistoric = false) => {
    if (!isHistoric) {
        setHistoricDate(null);
        setSearch("");
    }
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (currentListType === 'progression') {
        if (!token) { 
          setLevels([]); 
          setIsLoading(false);
          return; 
        }
        response = await axios.get('/api/personal-records', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLevels(response.data.map(record => ({ ...record, id: record.id, name: record.levelName, creator: user.username, videoId: record.videoUrl, thumbnail: record.thumbnailUrl, records: [], list: 'progression' })));
      } else {
        response = await axios.get(`/api/lists/${currentListType}-list`);
        setLevels(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch levels:", err);
      setError(`Failed to load '${listTitles[currentListType]}'. Please try again later.`);
      setLevels([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchHistoricList = async (date) => {
    setIsLoading(true);
    setError(null);
    setSearch("");
    try {
        const response = await axios.get(`/api/lists/main-list/history?date=${date}`);
        setLevels(response.data);
        setHistoricDate(new Date(date));
    } catch (err) {
        console.error("Failed to fetch historic list:", err);
        setError(`Failed to load history for ${date}.`);
        setLevels([]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, [currentListType, token]);
  
  const filteredLevels = levels.filter(level => {
    const searchTerm = search.toLowerCase();
    return (
      level.name.toLowerCase().includes(searchTerm) ||
      level.placement.toString().includes(searchTerm) ||
      (level.creator && level.creator.toLowerCase().includes(searchTerm)) ||
      (level.verifier && level.verifier.toLowerCase().includes(searchTerm))
    );
  });
  
  const handleOpenEditModal = (record) => { setRecordToEdit(record); setIsModalOpen(true); };
  const handleOpenAddModal = () => { setRecordToEdit(null); setIsModalOpen(true); };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete('/api/personal-records', { headers: { Authorization: `Bearer ${token}` }, data: { recordId } });
      fetchLevels();
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete record.'); }
  };

  const handlePinRecord = async (recordId) => {
    try {
      await axios.post('/api/users', { action: 'pin', recordId }, { headers: { Authorization: `Bearer ${token}` } });
      setPinnedRecordId(recordId);
    } catch(err) { alert(err.response?.data?.message || 'Failed to pin record.'); }
  };
  
  return (
    <>
      {isHistoryModalOpen && <HistoryModal onClose={() => setIsHistoryModalOpen(false)} onFetchHistory={fetchHistoricList} />}
      <div className="min-h-screen flex flex-col items-center pt-6 px-4">
        <div className="w-full max-w-4xl flex justify-center items-center mb-4 relative">
          <h1 className="font-poppins text-5xl font-bold text-center capitalize break-words">
            {listTitles[currentListType]}
          </h1>
          {currentListType === 'progression' && user && (
            <button 
              onClick={handleOpenAddModal}
              className="absolute right-0 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-gd-pink to-cyan-500 text-white hover:opacity-90 transition-all hover:scale-105 text-sm text-shadow-none"
            >
              <PlusCircle className="w-5 h-5" /> Add Record
            </button>
          )}
        </div>
        
        {historicDate && (
            <div className="w-full max-w-4xl mb-4 p-3 bg-gd-black/50 border border-gd-pink rounded-lg flex justify-between items-center">
                <p className="font-semibold">
                    Showing list as of {historicDate.toLocaleDateString()}
                </p>
                <button onClick={() => fetchLevels(false)} className="text-sm font-bold hover:underline">Return to Live List</button>
            </div>
        )}

        <div className="w-full max-w-4xl mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search by Level Name, Placement, Creator, or Verifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-3 rounded-lg border border-gd-purple bg-gd-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gd-pink focus:border-gd-pink text-shadow-none"
          />
          {currentListType === 'main' && (
            <button onClick={() => setIsHistoryModalOpen(true)} title="View List History" className="p-3 rounded-lg border border-gd-purple bg-gd-black/50 hover:bg-gd-purple/60 hover:border-gd-pink transition-colors">
                <History className="w-5 h-5"/>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {isLoading ? (
            <LoadingSpinner message="Loading List..." />
          ) : error ? (
            <p className="text-center mt-8">{error}</p>
          ) : filteredLevels.length > 0 ? (
            filteredLevels.map((level, index) => (
              <LevelCard 
                key={level.id || level.levelId || index} 
                level={level} 
                listType={currentListType}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                onPin={handlePinRecord}
                pinnedRecordId={pinnedRecordId}
              />
            ))
          ) : (
            <p className="text-center text-gray-200 mt-8">
              {t('no_levels_found')}
            </p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddPersonalRecordForm 
          recordCount={levels.length} 
          onClose={() => setIsModalOpen(false)} 
          onRecordAdded={fetchLevels}
          existingRecord={recordToEdit}
        />
      )}
    </>
  );
}