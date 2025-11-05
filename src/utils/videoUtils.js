// src/utils/videoUtils.js

/**
 * Transforms a YouTube URL or ID into usable URLs.
 * @param {string} urlOrId The original video URL or ID.
 * @param {any} [_cacheBust=null] This parameter is unused. It exists to force Vercel to break its build cache.
 * @returns {{embedUrl: string, thumbnailUrl: string, type: 'iframe'} | {embedUrl: null, thumbnailUrl: null, type: null}} An object with embeddable and thumbnail URLs.
 */
export const getVideoDetails = (urlOrId, _cacheBust = null) => {
  if (!urlOrId) {
    // Return a default object with a placeholder thumbnail
    return { 
      embedUrl: null, 
      thumbnailUrl: 'https://i.imgur.com/K8x1g1U.png', // Placeholder image
      type: null 
    };
  }

  const trimmedInput = urlOrId.trim();
  let videoId = null;

  // 1. Check for full YouTube URLs.
  const urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
  const urlMatch = trimmedInput.match(urlRegex);
  
  if (urlMatch && urlMatch[1]) {
    videoId = urlMatch[1].substring(0, 11); // Get the 11-character ID
  }

  // 2. Check for a raw 11-character ID.
  if (!videoId) {
    const rawIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (rawIdRegex.test(trimmedInput)) {
      videoId = trimmedInput;
    }
  }
  
  // 3. If we found a video ID, build the URLs
  if (videoId) {
    return { 
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, // Medium quality default
      type: 'iframe' 
    };
  }

  // 4. If it's not a valid YouTube URL or raw ID, use placeholder.
  return { 
    embedUrl: null, 
    thumbnailUrl: 'https://i.imgur.com/K8x1g1U.png', // Placeholder image
    type: null 
  };
};