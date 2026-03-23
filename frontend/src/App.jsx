import React, { useState, useEffect } from "react";
import api from "./api";
import Register from "./components/Register";
import { Route, Routes, Navigate } from "react-router-dom";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./Login";
import MyCourses from "./pages/MyCourses";
import Sidebar from "./components/Sidebar";
import InstructorDashboard from "./pages/InstructorDashboard";
import LessonEditor from "./pages/LessonEditor";

function App() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("access_token");
    return !!token && token !== "undefined";
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user_info");
      if (!savedUser || savedUser === "undefined") return null;
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCourses([]);
    setIsLoggedIn(false);
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/api/courses/${courseId}/enroll/`);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, is_enrolled: true } : c)),
      );
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Enroll failed:", error);
      }
    }
  };

  // 1. DATA FETCHING (Side Effects only)
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await api.get("/api/courses/");
        setCourses(response.data);
      } catch (error) {
        if (error.response?.status === 401) handleLogout();
      }
    };
    fetchCourses();
  }, [isLoggedIn]);

  // 2. AUTH SCREEN (If not logged in, show ONLY Login/Register)
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login setAuth={setIsLoggedIn} setUser={setUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 3. MAIN APP (Only reached if isLoggedIn is true)
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR */}
      <nav aria-label="Main Navigation">
        <Sidebar handleLogout={handleLogout} courses={courses} user={user} />
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-64 max-[500px]:ml-16">
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
            {/* TEACHER ONLY ROUTE */}
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
