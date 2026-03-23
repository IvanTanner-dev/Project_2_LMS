import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "My Courses", path: "/my-courses", icon: "📚" },
];

const Sidebar = ({ handleLogout, courses, user, isOpen, setIsOpen }) => {
  const location = useLocation();
  // Ensure we check for 'admin' role correctly.
  // Often admins should also see teacher features.
  const isAdmin = user?.role === "admin" || user?.username === "admin";
  const isTeacher = user?.role === "teacher" || isAdmin;

  // Auto-close on route change
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  let currentNav = [...NAV_ITEMS];
  // Add Teacher link if applicable
  if (isTeacher) {
    currentNav.push({
      name: "Teacher Portal",
      path: "/instructor",
      icon: "👨‍🏫",
    });
  }

  // Add Admin link if applicable
  if (isAdmin) {
    currentNav.push({
      name: "Admin Panel",
      path: "/admin",
      icon: "🛡️",
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
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 md:w-64 p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="text-2xl font-black tracking-tighter text-blue-500 flex items-center">
            LMS<span className="text-white">PRO</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          Menu
        </p>

        <nav className="space-y-2 flex-1">
          {currentNav.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-label={item.name}
                title={item.name}
                className={`flex items-center rounded-xl font-semibold transition-all duration-200 py-3 gap-3 px-4 justify-start ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* GLOBAL PROGRESS WIDGET */}
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

        {/* Optional: User Profile Mini-Card at bottom */}
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
      </div>
    </>
  );
};

export default Sidebar;
