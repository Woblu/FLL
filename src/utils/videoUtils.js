/**
 * This is the definitive utility to handle all video links for the FLL List.
 * It analyzes a URL and returns a standardized object with an embedUrl, 
 * a thumbnailUrl, and the player type.
 */
export const getVideoDetails = (url) => {
  if (!url) {
    return { 
      embedUrl: null, 
      thumbnailUrl: 'https://placehold.co/320x180/e2e8f0/334155?text=No+Preview',
      type: null 
    };
  }

  try {
    // --- YouTube ---
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      const videoId = youtubeMatch[1].substring(0, 11);
      return { 
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`, 
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        type: 'iframe' 
      };
    }

    // --- Medal.tv ---
    const medalRegex = /medal\.tv\/(?:games\/[^\/]+\/)?clips?\/([a-zA-Z0-9_-]+)/;
    const medalMatch = url.match(medalRegex);
    if (medalMatch && medalMatch[1]) {
      const clipId = medalMatch[1];
      return { 
        embedUrl: `https://medal.tv/clip/${clipId}/iframe`,
        thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Medal.tv+Clip',
        type: 'iframe'
      };
    }

    // --- Google Drive ---
    const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return { 
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
        thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Google+Drive',
        type: 'iframe' 
      };
    }

    // --- Direct MP4 Link ---
    if (new URL(url).pathname.endsWith('.mp4')) {
      return { 
        embedUrl: url, 
        thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=MP4+Video',
        type: 'video' 
      };
    }

  } catch (error) {
    // Fails silently if URL is invalid
  }

  // Fallback for any other link
  return { 
    embedUrl: null, 
    thumbnailUrl: 'https://placehold.co/320x180/e2e8f0/334155?text=Invalid+Link',
    type: null
  };
};