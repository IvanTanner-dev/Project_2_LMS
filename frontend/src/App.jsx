import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import CourseDetail from "./CourseDetail";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token"),
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("access_token");

      // If no token exists yet, don't even bother calling the API
      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: {
            // IMPORTANT: Ensure there are no extra spaces or typos here
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("API error:", error.response?.status);

        // If the token is dead, clear it and send them back to Login
        if (error.response?.status === 401) {
          handleLogout();
        }

        // Fallback to Mock Data so the UI doesn't break
        const mockData = [
          {
            id: 1,
            title: "Number Theory",
            level: "Lvl 1",
            progress: 45,
            is_enrolled: true, // This puts it in "My Learning"
            lessons: [],
          },
          {
            id: 2,
            title: "Advanced Calculus",
            level: "Lvl 3",
            progress: 10,
            is_enrolled: false, // This puts it in "Browse Catalog"
            lessons: [],
          },
          {
            id: 3,
            title: "Linear Algebra",
            level: "Lvl 2",
            progress: 80,
            is_enrolled: false,
            lessons: [],
          },
        ];
        setCourses(mockData);
      }
    };

    fetchCourses();
  }, [isLoggedIn]); // Re-runs when user logs in

  // If not logged in, only show the Login page (no sidebar)
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsLoggedIn} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("access_token");
    try {
      // 1. Tell the backend to enroll us
      await axios.post(
        `http://127.0.0.1:8000/api/courses/${courseId}/enroll/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 2. Immediately re-fetch courses to update the UI
      const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);

      console.log("Enrollment successful!");
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-blue-400 no-underline"
          >
            LMS Pro
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">
            Menu
          </div>
          <Link
            to="/"
            className="block px-4 py-2 rounded bg-blue-600 text-white no-underline"
          >
            Dashboard
          </Link>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition text-white no-underline"
          >
            My Courses
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Ivan T.</span>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard courses={courses} />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route
              path="/"
              element={<Dashboard courses={courses} onEnroll={handleEnroll} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
