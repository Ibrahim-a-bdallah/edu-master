// components/UniversalVideoPlayer.tsx
"use client";
import { useState } from "react";
import { extractVideoId, isValidVideoId } from "@/lib/vimeoHelpers";

interface UniversalVideoPlayerProps {
  videoUrl: string;
  isUnlocked: boolean;
  title: string;
}

const UniversalVideoPlayer = ({
  videoUrl,
  isUnlocked,
  title,
}: UniversalVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // استخراج معلومات الفيديو
  const videoInfo = extractVideoId(videoUrl);
  const isValid = isValidVideoId(videoInfo.platform, videoInfo.id);

  if (!isUnlocked) {
    return <LockedVideoView />;
  }

  if (!isValid) {
    return <PremiumUnsupportedView videoUrl={videoUrl} />;
  }

  if (!isPlaying) {
    return (
      <ThumbnailView
        platform={videoInfo.platform}
        videoId={videoInfo.id!}
        title={title}
        onPlay={() => setIsPlaying(true)}
      />
    );
  }

  return (
    <VideoPlayer
      platform={videoInfo.platform}
      videoId={videoInfo.id!}
      title={title}
    />
  );
};

// 🔒 مكون الفيديو المغلق
const LockedVideoView = () => (
  <div className="relative w-full h-48 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
    <div className="text-center text-white p-4">
      <div className="text-4xl mb-3">🔒</div>
      <h3 className="font-bold text-lg mb-2">Premium Content</h3>
      <p className="text-sm opacity-90 mb-3">
        Unlock this lesson to access the video
      </p>
      <span className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm">
        Pay to Unlock
      </span>
    </div>
  </div>
);

// ❌ مكون الفيديو غير المدعوم (بشكل جميل)
// ❌ مكون فاخر للفيديو غير المتاح
const PremiumUnsupportedView = ({ videoUrl }: { videoUrl: string }) => (
  <div className="relative w-full h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
    {/* خلفية متحركة */}
    <div className="absolute inset-0 opacity-5">
      <div className="animate-pulse bg-gradient-to-r from-blue-400 to-purple-400 w-full h-full"></div>
    </div>

    <div className="text-center text-slate-700 p-6 max-w-sm relative z-10">
      <div className="text-5xl mb-4">🎬</div>
      <h3 className="font-bold text-xl mb-3">Content Coming Soon</h3>
      <p className="text-sm mb-4 leading-relaxed">
        This video is temporarily unavailable while we upgrade our video
        platform for better quality.
      </p>
      <div className="flex justify-center gap-2">
        <span className="bg-slate-700 text-white text-xs px-3 py-1 rounded-full">
          Under Maintenance
        </span>
        <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full">
          Updated Soon
        </span>
      </div>
    </div>
  </div>
);
// 🖼️ مكون Thumbnail (كما هو)
const ThumbnailView = ({ platform, videoId, title, onPlay }: any) => {
  let thumbnailUrl = "";
  let platformColor = "";

  if (platform === "youtube") {
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    platformColor = "bg-red-600";
  } else if (platform === "vimeo") {
    thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
    platformColor = "bg-blue-600";
  }

  return (
    <div
      className="relative w-full h-48 bg-cover bg-center rounded-lg cursor-pointer group"
      style={{ backgroundImage: `url(${thumbnailUrl})` }}
      onClick={onPlay}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-lg">
        <div
          className={`${platformColor} rounded-full w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform`}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white text-sm font-semibold drop-shadow-md truncate">
          {title}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            {platform === "youtube" ? "YouTube" : "Vimeo"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ▶️ مكون الفيديو النشط (كما هو)
const VideoPlayer = ({ platform, videoId, title }: any) => {
  let embedUrl = "";

  if (platform === "youtube") {
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  } else if (platform === "vimeo") {
    embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default UniversalVideoPlayer;
