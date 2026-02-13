import React, { useState } from 'react';
import ListManager from '../components/admin/ListManager';

export default function AdminDashboard() {
  const [listToManage, setListToManage] = useState('main-list'); // State to track the current list

  const getButtonClasses = (listName) => {
    return listToManage === listName
      ? 'px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg' // Active
      : 'px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-ui-bg/50 border border-gray-300 dark:border-accent/30 rounded-lg hover:bg-gray-100 dark:hover:bg-accent/20'; // Inactive
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center border-b-2 border-dotted border-gray-400 dark:border-accent/50 pb-8 mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
          List Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Move or remove levels from the list. New levels are added via the public "Submit Level" page.
        </p>
      </div>

      {/* --- LIST SWITCHER UI --- */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setListToManage('dl-list')}
          className={getButtonClasses('dl-list')}
        >
          Manage DL (dl-list)
        </button>
        <button
          onClick={() => setListToManage('main-list')}
          className={getButtonClasses('main-list')}
        >
          Manage FLL (main-list)
        </button>
        <button
          onClick={() => setListToManage('hdl-list')}
          className={getButtonClasses('hdl-list')}
        >
          Manage HDL (hdl-list)
        </button>
      </div>
      {/* --- END OF SWITCHER --- */}

      {/* Pass the current list to ListManager */}
      <ListManager key={listToManage} listToManage={listToManage} />
    </div>
  );
}