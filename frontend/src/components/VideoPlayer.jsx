import React from "react";

const VideoPlayer = ({ lesson, onComplete }) => {
  if (!lesson) {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center text-slate-400 font-medium">
        Select a lesson to begin your journey.
      </div>
    );
  }

  // Helper to ensure YouTube links work in an iframe
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* 📺 Video Frame */}
      <div className="aspect-video bg-black w-full shadow-xl">
        <iframe
          className="w-full h-full"
          src={getEmbedUrl(lesson.video_url)}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 📝 Lesson Info & Action */}
      <div className="p-8 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
              Active Lesson
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {lesson.title}
            </h1>
          </div>

          <button
            onClick={onComplete}
            disabled={lesson.is_completed}
            className={`px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
              lesson.is_completed
                ? "bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {lesson.is_completed ? "✓ Lesson Complete" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
