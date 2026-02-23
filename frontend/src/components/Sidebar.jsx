import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "My Courses", path: "/my-courses", icon: "📚" },
];

const Sidebar = ({ handleLogout, courses, user }) => {
  const location = useLocation();
  const isTeacher = user?.role === "teacher";
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
    <div className="w-64 bg-slate-900 h-screen p-6 text-white flex flex-col fixed left-0 top-0">
      <div className="text-2xl font-black tracking-tighter mb-10 text-blue-500">
        LMS<span className="text-white">PRO</span>
      </div>

      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
        Menu
      </p>

      <nav className="space-y-2 flex-1">
        {currentNav.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 📊 GLOBAL PROGRESS WIDGET */}
      <div className="mt-auto mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
          <p className="text-[9px] text-slate-500 mt-2 italic">
            {averageProgress === 100
              ? "Goal reached! 🏆"
              : "Keep up the momentum!"}
          </p>
        </div>
      </div>

      {/* Optional: User Profile Mini-Card at bottom */}
      <div className="border-t border-slate-800 pt-6 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="text-sm">
            <button
              onClick={handleLogout}
              className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold tracking-tighter"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
