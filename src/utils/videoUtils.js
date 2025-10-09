/**
 * Transforms various video URLs into a usable embed object.
 * @param {string} url The original video URL from any source.
 * @param {string} hostname The hostname of your website (for Twitch embeds).
 * @returns {{url: string, type: 'iframe' | 'video'} | null}
 */
export const getVideoEmbedUrl = (url, hostname) => {
  if (!url) return null;

  try {
    // --- YouTube ---
    // Handles youtube.com, youtu.be, and shorts
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\n]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      const videoId = youtubeMatch[1].substring(0, 11);
      return { url: `https://www.youtube-nocookie.com/embed/${videoId}`, type: 'iframe' };
    }

    // --- Medal.tv ---
    // This uses the official embed format. If it's blocked, it's a Medal.tv policy.
    const medalRegex = /medal\.tv\/(?:games\/[^\/]+\/)?clips?\/([a-zA-Z0-9_-]+)/;
    const medalMatch = url.match(medalRegex);
    if (medalMatch && medalMatch[1]) {
      const clipId = medalMatch[1];
      return { url: `https://medal.tv/clip/${clipId}/iframe`, type: 'iframe' };
    }

    // --- Google Drive ---
    const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return { url: `https://drive.google.com/file/d/${driveMatch[1]}/preview`, type: 'iframe' };
    }

    // --- Direct MP4 Link ---
    if (new URL(url).pathname.endsWith('.mp4')) {
      return { url, type: 'video' };
    }

  } catch (error) {
    console.error("Could not parse URL:", url, error);
    return null;
  }

  // If no patterns match, we cannot embed it.
  return null;
};