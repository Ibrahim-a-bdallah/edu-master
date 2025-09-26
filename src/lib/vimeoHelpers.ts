// utils/videoHelpers.ts
export const extractVideoId = (
  url: string
): { platform: "youtube" | "vimeo" | "unknown"; id: string | null } => {
  if (!url || typeof url !== "string") {
    return { platform: "unknown", id: null };
  }

  // === YouTube Patterns ===
  // https://youtu.be/nNh_Jq7mPbM
  const youtuBeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  if (youtuBeMatch) {
    return { platform: "youtube", id: youtuBeMatch[1] };
  }

  // https://www.youtube.com/watch?v=nNh_Jq7mPbM
  const youtubeWatchMatch = url.match(
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/
  );
  if (youtubeWatchMatch) {
    return { platform: "youtube", id: youtubeWatchMatch[1] };
  }

  // === Vimeo Patterns ===
  // https://vimeo.com/123456789
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  // https://player.vimeo.com/video/123456789
  const vimeoPlayerMatch = url.match(/(?:player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoPlayerMatch) {
    return { platform: "vimeo", id: vimeoPlayerMatch[1] };
  }

  return { platform: "unknown", id: null };
};

export const isValidVideoId = (
  platform: string,
  id: string | null
): boolean => {
  if (!id) return false;

  switch (platform) {
    case "youtube":
      return /^[a-zA-Z0-9_-]{11}$/.test(id); // YouTube IDs طولها 11 حرف
    case "vimeo":
      return /^\d+$/.test(id) && id.length >= 8; // Vimeo IDs أرقام طويلة
    default:
      return false;
  }
};
