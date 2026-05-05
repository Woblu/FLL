/**
 * Background layers for list and landing pages (Demonlist-style depth behind side art):
 * base fill, soft glows, masked grid, subtle noise, vignette. Absolute inside a relative
 * parent so it scrolls with the page.
 * Pointer-events none.
 *
 * @module ListPagesAtmosphere
 */

import React from 'react';

/**
 * @returns {JSX.Element}
 */
export default function ListPagesAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="list-pages-atmosphere-base absolute inset-0" />
      <div className="list-pages-atmosphere-glow absolute inset-0" />
      <div className="list-pages-atmosphere-grid absolute inset-0" />
      <div className="list-pages-atmosphere-noise absolute inset-0" />
      <div className="list-pages-atmosphere-vignette absolute inset-0" />
    </div>
  );
}
