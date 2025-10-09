// This function will analyze a URL and return a standardized object 
// with the video source, an embeddable URL, and a thumbnail URL.

export const getVideoDetails = (url) => {
  if (!url) {
    return { 
      source: 'unknown', 
      embedUrl: null, 
      thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=No+Preview' 
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
    };
  }

  // 2. Medal.tv
  const medalRegex = /medal\.tv\/(?:games\/[^\/]+\/)?clips?\/([^\/]+)/;
  const medalMatch = url.match(medalRegex);
  if (medalMatch && medalMatch[1]) {
    const clipId = medalMatch[1];
    return {
      source: 'medal',
      // --- FIX: Using the correct public embed URL for Medal.tv ---
      embedUrl: `https://medal.tv/e/c/${clipId}`,
      thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Medal.tv+Clip',
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
    };
  }

  // 4. Fallback for unknown URLs
  return { 
    source: 'unknown', 
    embedUrl: null, 
    thumbnailUrl: 'https://placehold.co/320x180/10081c/ffffff?text=Invalid+Link' 
  };
};