// src/utils/videoUtils.js

/**
 * Transforms a video URL from various services into usable embed and thumbnail URLs.
 * @param {string} urlOrId The original video URL or ID.
 * @param {string} [hostname=''] The current window.location.hostname, required for Twitch embeds.
 * @returns {{embedUrl: string, thumbnailUrl: string, type: 'iframe'} | {embedUrl: null, thumbnailUrl: string, type: null}}
 */
export const getVideoDetails = (urlOrId, hostname = '') => {
  const placeholderThumbnail = 'https://i.imgur.com/K8x1g1U.png'; // Default placeholder

  if (!urlOrId) {
    return { 
      embedUrl: null, 
      thumbnailUrl: placeholderThumbnail,
      type: null 
    };
  }

  const trimmedInput = urlOrId.trim();
  let videoId = null;

  try {
    // 1. YouTube
    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
    const ytMatch = trimmedInput.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      videoId = ytMatch[1].substring(0, 11); // Get the 11-character ID
      return { 
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        type: 'iframe' 
      };
    }
    // Check for raw 11-character YouTube ID
    const rawYtRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (rawYtRegex.test(trimmedInput)) {
      videoId = trimmedInput;
      return { 
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        type: 'iframe' 
      };
    }

    // 2. Google Drive
    // Example: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = trimmedInput.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      videoId = driveMatch[1];
      return {
        embedUrl: `https://drive.google.com/file/d/${videoId}/preview`,
        thumbnailUrl: placeholderThumbnail, // GDrive has no public thumbnail API
        type: 'iframe'
      };
    }

    // 3. Twitch (VODs)
    // Example: https://www.twitch.tv/videos/123456789
    const twitchVodRegex = /twitch\.tv\/videos\/(\d+)/;
    const twitchVodMatch = trimmedInput.match(twitchVodRegex);
    if (twitchVodMatch && twitchVodMatch[1]) {
      videoId = twitchVodMatch[1];
      return {
        embedUrl: `https://player.twitch.tv/?video=${videoId}&parent=${hostname}&autoplay=false`,
        thumbnailUrl: placeholderThumbnail,
        type: 'iframe'
      };
    }

    // 4. Twitch (Clips)
    // Example: https://clips.twitch.tv/ClipID
    // Example: https://www.twitch.tv/username/clip/ClipID
    const twitchClipRegex = /(?:clips\.twitch\.tv\/|twitch\.tv\/(?:[^\/]+)\/clip\/)([a-zA-Z0-9_-]+)/;
    const twitchClipMatch = trimmedInput.match(twitchClipRegex);
    if (twitchClipMatch && twitchClipMatch[1]) {
      videoId = twitchClipMatch[1];
      return {
        embedUrl: `https://clips.twitch.tv/embed?clip=${videoId}&parent=${hostname}&autoplay=false`,
        thumbnailUrl: placeholderThumbnail,
        type: 'iframe'
      };
    }

    // 5. Medal.tv
    // Example: https://medal.tv/games/game-name/clips/ClipID
    const medalRegex = /medal\.tv\/(?:games\/[^\/]+\/)?clips\/([a-zA-Z0-9_-]+)/;
    const medalMatch = trimmedInput.match(medalRegex);
    if (medalMatch && medalMatch[1]) {
      videoId = medalMatch[1];
      return {
        embedUrl: `https://medal.tv/clip/${videoId}/embed`,
        thumbnailUrl: placeholderThumbnail, // Medal has no public thumbnail API
        type: 'iframe'
      };
    }

  } catch (e) {
    console.error("Error parsing video URL:", e);
    // Fall through to return placeholder
  }
  
  // If no regex matched, return the placeholder
  return { 
    embedUrl: null, 
    thumbnailUrl: placeholderThumbnail,
    type: null 
  };
};