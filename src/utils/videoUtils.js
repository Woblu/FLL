/**
 * This function analyzes a URL and returns a standardized object with the
 * video source, an embeddable URL, a thumbnail URL, and the player type.
 */
export const getVideoDetails = (url) => {
  if (!url) {
    return { 
      source: 'unknown', 
      embedUrl: null, 
      thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=No+Preview',
      type: null
    };
  }

  // 1. YouTube
  const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1].substring(0, 11);
    return {
      source: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      type: 'iframe'
    };
  }

  // 2. Medal.tv (Corrected Logic)
  // The regex now correctly finds the clip ID from various URL formats.
  const medalRegex = /medal\.tv\/(?:games\/[^\/]+\/)?clips?\/([a-zA-Z0-9_-]+)/;
  const medalMatch = url.match(medalRegex);
  if (medalMatch && medalMatch[1]) {
    const clipId = medalMatch[1];
    return {
      source: 'medal',
      // This is the official, publicly-facing embed URL format.
      embedUrl: `https://medal.tv/clip/${clipId}/iframe`,
      thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Medal.tv+Clip',
      type: 'iframe'
    };
  }

  // 3. Google Drive
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([^\/&?]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      source: 'googledrive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Google+Drive',
      type: 'iframe'
    };
  }
  
  // 4. Direct MP4 Link
  try {
    const urlObject = new URL(url);
    if (urlObject.pathname.endsWith('.mp4')) {
      return { 
        source: 'direct',
        embedUrl: url, 
        thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=MP4+Video',
        type: 'video' 
      };
    }
  } catch (e) {
    // Not a valid URL, will be caught by the fallback.
  }

  // 5. Fallback for unknown URLs
  return { 
    source: 'unknown', 
    embedUrl: null, 
    thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Invalid+Link',
    type: null
  };
};