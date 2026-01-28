import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    // Replace this URL with your actual Django endpoint later
    // For now, we are simulating the connection
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/courses/");
        setCourses(response.data);
        console.log("Success! Real data loaded.", response.data);
      } catch (error) {
        // Everything that goes wrong (API offline, 404, CORS error) ends up here
        console.warn("⚠️ API handshake failed. Falling back to Mock Data.");
        console.error("Error details:", error.message);

        // MOCK DATA for testing the handshake logic:
        const mockData = [
          { id: 1, title: "Number Theory", level: "Lvl 1", progress: 45 },
          { id: 2, title: "Advanced Calculus", level: "Lvl 3", progress: 10 },
          { id: 3, title: "Linear Algebra", level: "Lvl 2", progress: 80 },
        ];
        setCourses(mockData);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR - Spanning roughly 2-3 columns in your Figma grid */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">
            LMS Pro
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">
            Menu
          </div>
          <a
            href="#"
            className="block px-4 py-2 rounded bg-blue-600 text-white"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            My Courses
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            Assignments
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            Messages
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="text-sm text-slate-400 hover:text-white">
            Settings
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR - That horizontal bar at the top */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Ivan T.</span>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">Welcome back, Student!</h3>
            <p className="text-gray-500">
              Here is what's happening with your courses today.
            </p>
          </div>

          {/* THE 12-COLUMN GRID - Just like your Figma Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* COURSE CARD 1 - Spans 3 columns */}
            {/* NEW DYNAMIC MAP START */}
            {courses.map((course) => (
              <div
                key={course.id}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="h-40 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">
                    Course Thumbnail
                  </span>
                </div>
                <div className="p-5">
                  {/* Use teacher_name instead of level */}
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Instructor: {course.teacher_name}
                  </span>

                  <h4 className="font-bold text-lg mt-1">{course.title}</h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mt-2">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mr-3">
                      {/* We'll use the number of lessons to simulate progress for now */}
                      <div
                        className="bg-blue-600 h-full transition-all duration-500"
                        style={{ width: `${course.lessons.length * 20}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {course.lessons.length * 20}%
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 italic">
                    {course.lessons.length} Lessons Available
                  </div>

                  <button className="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
                    View {course.lessons.length} Lessons
                  </button>
                </div>
              </div>
            ))}
            {/* NEW DYNAMIC MAP END */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
