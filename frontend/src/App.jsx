import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./Login";
import MyCourses from "./pages/MyCourses";
import Sidebar from "./components/Sidebar";
import InstructorDashboard from "./pages/InstructorDashboard";
import LessonEditor from "./pages/LessonEditor";

function App() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token"),
  );
  // Initialize user from localStorage so it persists on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_info");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCourses([]); // Clear data so the UI resets
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("access_token");

      if (!token || !isLoggedIn) {
        console.log("No token found yet, staying in guest mode.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: {
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
      }
    };

    fetchCourses();
  }, [isLoggedIn]); // Re-runs when user logs in

  // If not logged in, only show the Login page (no sidebar)
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login setAuth={setIsLoggedIn} setUser={setUser} />}
        />
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
      <nav aria-label="Main Navigation">
        <Sidebar handleLogout={handleLogout} courses={courses} user={user} />
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">
              {user?.first_name
                ? `${user.first_name} ${user.last_name ? user.last_name[0] + "." : ""}`
                : user?.username}
            </span>
            <div
              className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-sm font-bold"
              role="img"
              aria-label="User Avatar"
            >
              {user?.first_name
                ? (
                    user.first_name[0] +
                    (user.last_name ? user.last_name[0] : "")
                  ).toUpperCase()
                : (user?.username ? user.username[0] : "U").toUpperCase()}
            </div>
          </div>
        </header>

        <main id="main-content" className="p-10 min-h-[calc(100vh-64px)]">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  courses={courses}
                  onEnroll={handleEnroll}
                  studentName={
                    user?.first_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || "Student"
                  }
                />
              }
            />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/my-courses" element={<MyCourses />} />
            {/* 👨‍🏫 TEACHER ONLY ROUTE */}
            {user?.role === "teacher" && (
              <>
                <Route
                  path="/instructor"
                  element={
                    <InstructorDashboard
                      courses={courses}
                      setCourses={setCourses}
                    />
                  }
                />
                <Route
                  path="/instructor/course/:courseId/lessons"
                  element={<LessonEditor />}
                />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
