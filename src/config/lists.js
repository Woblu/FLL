/**
 * Global list configuration.
 * Defines the available lists and their metadata for navigation and routing.
 */

// 1. Define the default order of tabs in the navigation bar
export const DEFAULT_NAV_LIST_IDS = ['fll', 'hdl'];

// 2. Define the exact details for your two new lists
export const LIST_BY_ID = {
  fll: {
    id: 'fll',
    navLabelKey: 'FLL', // This is what shows up on the NavBar tab
    pageTitle: 'The FLL List', // This is the title of the page
  },
  hdl: {
    id: 'hdl',
    navLabelKey: 'HDL', 
    pageTitle: 'The HDL List',
  }
};

// 3. Helper function used by the NavBar and Stats Viewer to verify a list exists
export const isStatsViewerListType = (listId) => {
  return Object.prototype.hasOwnProperty.call(LIST_BY_ID, listId);
};