import React, { useState, useMemo } from "react";
import CopyToClipboard from "./CopyToClipboard";

export default function YouTubePlayer({ url, title = '', isLabel = false, isActionBtn = false }) {
  const [playing, setPlaying] = useState(false);

  const videoId = useMemo(() => {
    try {
      if (!url) return null;
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }
      if (u.pathname.includes("embed")) {
        const parts = u.pathname.split("/");
        return parts[parts.length - 1];
      }
      // check search param v
      const v = u.searchParams.get("v");
      if (v) return v;
      // last fallback: maybe the id is the last path segment
      const segments = u.pathname.split("/").filter(Boolean);
      return segments.length ? segments[segments.length - 1] : null;
    } catch (e) {
      return null;
    }
  }, [url]);

  if (!videoId) {
    return (
      <div className="max-w-xl mx-auto p-4 rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-sm text-red-600">Invalid YouTube URL</div>
        <div className="text-sm text-gray-600 mt-2">Berikan URL YouTube yang valid, misalnya: <code className="bg-white px-1 rounded">https://www.youtube.com/watch?v=VIDEO_ID</code></div>
      </div>
    );
  }

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative rounded-lg overflow-hidden shadow-md bg-black">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group w-full block focus:outline-none"
          >
            <div className="aspect-video bg-gray-900 relative">
              <img
                src={thumbnail}
                alt={`${title} thumbnail`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-200 ease-out"
                loading="lazy"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-black bg-opacity-60 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {isLabel && !!title ? (
                <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-white text-sm font-semibold truncate">{title}</div>
                </div>
              ) : null}
            </div>
          </button>
        ) : (
          <div className="aspect-video">
            <iframe
              title={title}
              src={embedSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        )}
      </div>

      {isActionBtn ? (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CopyToClipboard data={url} label="Link Youtube" btnLabel="Salin link" btnClassName="px-3 py-1 rounded text-sm border border-gray-200 hover:bg-gray-50" />

            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded text-sm border border-gray-200 hover:bg-gray-50"
            >
              Buka di YouTube
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
