/**
 * @fileoverview Footer component displaying copyright, links, and credits.
 * Appears globally at the bottom of all pages.
 * 
 * @module Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Code, ExternalLink } from 'lucide-react';

/**
 * Footer component
 * @returns {JSX.Element} Footer JSX
 */
export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-[70] mt-auto border-t border-primary-bg bg-ui-bg/90 py-8 backdrop-blur-md supports-[backdrop-filter]:bg-ui-bg/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Copyright & Info */}
          <div>
            <h3 className="text-lg font-bold text-text-on-ui mb-3">DashRank</h3>
            <p className="text-sm text-text-muted mb-2">
              {(t('footerCopyright') || `© ${currentYear} DashRank. All rights reserved.`).replace('{year}', currentYear.toString())}
            </p>
            <p className="text-xs text-text-muted">
              {t('not_affiliated_robtop') || 'Not affiliated with RobTop Games AB.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold text-text-on-ui mb-3">
              {t('footerLinks') || 'Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/vazX9HcXCQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                >
                  {t('footerDiscord') || 'Discord'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-sm text-text-muted hover:text-accent transition-colors"
                >
                  {t('guidelines') || 'Guidelines'}
                </Link>
              </li>
              <li>
                <Link
                  to="/credits"
                  className="text-sm text-text-muted hover:text-accent transition-colors"
                >
                  {t('credits') || 'Credits'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-lg font-bold text-text-on-ui mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t('footerDevelopers') || 'Developers'}
            </h3>
            <p className="text-xs text-text-muted mb-3">
              {t('footerApiInfo') || 'API documentation available for developers.'}
            </p>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              {t('footerApiDocs') || 'API Documentation'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
