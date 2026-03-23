import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import SyllabusSidebar from "../components/SyllabusSidebar";
import VideoPlayer from "../components/VideoPlayer";
import { fireConfetti } from "../utils/confetti";

const CourseDetail = () => {
  const { id } = useParams(); // Grabs the '1' out of /course/1
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/api/courses/${id}/`);

        const freshData = response.data;
        setCourse(freshData);

        if (freshData.lessons && freshData.lessons.length > 0) {
          const nextIncomplete = freshData.lessons.find(
            (lesson) => !lesson.is_completed,
          );

          if (nextIncomplete) {
            setSelectedLesson(nextIncomplete);
          } else {
            setSelectedLesson(freshData.lessons[0]);
            fireConfetti();
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const markLessonComplete = async () => {
    if (!selectedLesson) return;

    try {
      await api.post(`/api/lessons/${selectedLesson.id}/complete/`);

      setCourse((prevCourse) => ({
        ...prevCourse,
        lessons: prevCourse.lessons.map((lesson) =>
          lesson.id === selectedLesson.id
            ? { ...lesson, is_completed: true }
            : lesson,
        ),
      }));

      handleNextLesson();
    } catch (err) {
      console.error("Error marking lesson complete:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
    }
  };

  const handleNextLesson = () => {
    if (!course || !selectedLesson) return;

    const currentIndex = course.lessons.findIndex(
      (l) => l.id === selectedLesson.id,
    );

    if (currentIndex !== -1 && currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      fireConfetti();
    }
  };

  const completedCount =
    course?.lessons?.filter((l) => l.is_completed).length || 0;
  const totalCount = course?.lessons?.length || 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) return <div className="p-10">Loading your lessons...</div>;
  if (!course) return <div className="p-8">Loading course details...</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BREADCRUMB */}
      <nav className="mb-6 flex items-center text-sm text-gray-500">
        <Link
          to="/"
          aria-label="Back to dashboard"
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">{course.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: THE ACTION CENTER */}
        <div className="col-span-12 lg:col-span-8">
          {/* We use 'relative' here so the Blue Screen stays inside this box */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* 1. THE VIDEO PLAYER & MAIN ACTION BUTTON */}
            <VideoPlayer
              lesson={selectedLesson}
              onComplete={markLessonComplete}
            />

            {/* 2. THE COMPLETION OVERLAY (Only shows at 100%) */}
            {progressPercentage === 100 && (
              <div className="absolute inset-0 bg-blue-700/95 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 animate-in fade-in zoom-in duration-300">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="text-4xl font-bold mb-2">Course Completed!</h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Excellent work on mastering {course.title}
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {/* 3. SUB-DETAILS (Reduced redundancy) */}
            <div className="p-8 border-t border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
                    Lesson Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedLesson?.content ||
                      "No detailed description available for this lesson yet."}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="block text-xs text-gray-400 uppercase font-bold">
                    Progress
                  </span>
                  <span className="text-lg font-mono font-bold text-gray-700">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE SYLLABUS */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-6 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Course Syllabus</h3>
            </div>
            <SyllabusSidebar
              lessons={course.lessons}
              selectedLesson={selectedLesson}
              onSelectLesson={setSelectedLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
