import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams(); // Grabs the '1' out of /course/1
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/courses/${id}/`,
        );
        setCourse(response.data);
        if (response.data.lessons && response.data.lessons.length > 0) {
          setSelectedLesson(response.data.lessons[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Could not find course details", err);
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  if (loading) return <div className="p-10">Loading your lessons...</div>;
  if (!course) return <div className="p-8">Loading course details...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* BREADCRUMB */}
      <nav className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">{course.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: THE PLAYER (8 Columns) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* VIDEO PLACEHOLDER */}
            <div className="aspect-video bg-slate-900 flex items-center justify-center text-white border-b border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-500 transition">
                  <svg
                    className="w-8 h-8 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-slate-400">Lesson Video will play here</p>
              </div>
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedLesson?.title}
              </h1>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold mr-4">
                  Module 1
                </span>
                <span>Duration: 12:45</span>
              </div>
              <div className="mt-8 prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold">About this lesson</h3>
                <p className="text-gray-600 leading-relaxed mt-2">
                  {selectedLesson?.content ||
                    "No detailed description available for this lesson yet."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LESSON LIST (4 Columns) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-200px)] sticky top-24">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Course Content</h2>
              <p className="text-xs text-gray-500 mt-1">
                {course.lessons.length} lessons total
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full flex items-start p-4 rounded-xl transition text-left group ${
                    selectedLesson?.id === lesson.id
                      ? "bg-blue-50 border-blue-100"
                      : "hover:bg-gray-50 border-transparent"
                  } border`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mr-4 transition ${
                      selectedLesson?.id === lesson.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${selectedLesson?.id === lesson.id ? "text-blue-900" : "text-gray-700"}`}
                    >
                      {lesson.title}
                    </h4>
                    <span className="text-xs text-gray-400">
                      Video • 10 mins
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
