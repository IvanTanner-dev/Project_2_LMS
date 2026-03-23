import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "My Courses", path: "/my-courses", icon: "📚" },
];

const Sidebar = ({ handleLogout, courses, user }) => {
  const location = useLocation();
  const isTeacher = user?.role === "teacher";
  const [isCompact, setIsCompact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)");

    const update = () => setIsCompact(mq.matches);
    update();

    // Safari fallback for older event APIs
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const expanded = !isCompact || isHovered;

  let currentNav = [...NAV_ITEMS];
  // Add Teacher link if applicable
  if (isTeacher) {
    currentNav.push({
      name: "Teacher Portal",
      path: "/instructor",
      icon: "👨‍🏫",
    });
  }

  // 2. Calculate Global Progress (Average of all enrolled courses)
  const enrolledCourses = courses.filter(
    (c) => c.progress_percentage !== undefined,
  );
  const totalProgress = enrolledCourses.reduce(
    (acc, c) => acc + (c.progress_percentage || 0),
    0,
  );
  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(totalProgress / enrolledCourses.length)
      : 0;

  return (
    <div
      className={`bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 transition-[width,padding] duration-200 ${
        expanded ? "w-64 p-6" : "w-16 p-3"
      }`}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-2xl font-black tracking-tighter mb-10 text-blue-500 flex items-center">
        LMS
        {expanded && <span className="text-white">PRO</span>}
      </div>

      {expanded && (
        <p className="text-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          Menu
        </p>
      )}

      <nav className="space-y-2 flex-1">
        {currentNav.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name}
              title={item.name}
              className={`flex items-center rounded-xl font-semibold transition-all duration-200 py-3 ${
                expanded
                  ? "gap-3 px-4 justify-start"
                  : "gap-0 px-0 justify-center"
              } ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              onMouseEnter={() => {
                if (isCompact) setIsHovered(true);
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
              {expanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 📊 GLOBAL PROGRESS WIDGET */}
      {expanded && (
        <div className="mt-auto mb-6">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">
                Total Progress
              </span>
              <span className="text-lg font-black text-blue-400 leading-none">
                {averageProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-200 mt-2 italic">
              {averageProgress === 100
                ? "Goal reached! 🏆"
                : "Keep up the momentum!"}
            </p>
          </div>
        </div>
      )}

      {/* Optional: User Profile Mini-Card at bottom */}
      {expanded && (
        <div className="border-t border-slate-800 pt-6 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="text-sm">
              <button
                onClick={handleLogout}
                className="text-[10px] text-slate-200 hover:text-red-200 transition-colors uppercase font-bold tracking-tighter"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
