import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function PlayerList() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <header className="bg-ui-bg/80 border border-primary-bg rounded-xl p-4 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('players') || 'Players'}
        </h1>
        <p className="text-sm text-text-muted">
          {t('players_coming_soon') || 'Player directory coming soon.'}
        </p>
      </header>
    </div>
  );
}

