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
    <div className="flex-1 flex flex-col bg-white">
      {/* 📺 Video Frame - Removed shadow for a flush look */}
      <div className="aspect-video bg-black w-full">
        <iframe
          className="w-full h-full"
          src={getEmbedUrl(lesson.video_url)}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 📝 Lesson Info & Action - Now Flush and Integrated */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em]">
              Active Lesson
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {lesson.title}
            </h2>
          </div>

          <button
            onClick={onComplete}
            disabled={lesson.is_completed}
            className={`px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
              lesson.is_completed
                ? "bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {lesson.is_completed ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lesson Complete
              </span>
            ) : (
              "Mark as Complete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
