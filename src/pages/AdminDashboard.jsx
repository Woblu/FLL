import React from 'react';
import ListManager from '../components/admin/ListManager';

export default function AdminDashboard() {
  return (
    <div className="text-gd-white max-w-7xl mx-auto py-8 px-4">
      <div className="text-center border-b-2 border-dotted border-gd-purple pb-8 mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gd-white drop-shadow-glow-pink">
          List Management
        </h1>
        <p className="text-gd-gray mt-4">
          Move or remove levels from the list. New levels are added via the public "Submit Level" page.
        </p>
      </div>

      <ListManager />
    </div>
  );
}