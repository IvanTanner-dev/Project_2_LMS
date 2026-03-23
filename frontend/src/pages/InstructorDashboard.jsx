import React, { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Analytics from "../components/Analytics";

const InstructorDashboard = ({ courses, setCourses }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseAnalytics, setSelectedCourseAnalytics] = useState(null);

  // Filters the courses to show only yours
  const myCourses = courses.filter((c) => c.teacher_name === "admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/courses/", formData);

      // Add the new course to our local state so it appears immediately
      setCourses([...courses, response.data]);

      // Reset the form
      setFormData({ title: "", description: "" });
      setShowForm(false);
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error.response?.data);
      alert("Failed to create course. Check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* ANALYTICS OVERLAY/VIEW */}
      {selectedCourseAnalytics && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Course Insights: {selectedCourseAnalytics.title}
              </h2>
              <p className="text-slate-500 font-medium">
                Deep dive into enrollment and performance metrics.
              </p>
            </div>
            <button
              onClick={() => setSelectedCourseAnalytics(null)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
            >
              ← Back to List
            </button>
          </div>

          {/* Reuse the Analytics component with only the selected course */}
          <Analytics courses={[selectedCourseAnalytics]} />
        </div>
      )}

      {!selectedCourseAnalytics && (
        <>
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-slate-500 text-sm md:base font-medium">
                Manage your content and track student engagement.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all text-sm md:text-base"
            >
              {showForm ? "Cancel" : "+ Create New Course"}
            </button>
          </div>

          {/* CREATION FORM */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <h2 className="text-xl font-bold text-slate-800">
                New Course Details
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Title (e.g., Advanced Calculus)"
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Course Description"
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                    isSubmitting
                      ? "bg-slate-400"
                      : "bg-slate-900 hover:bg-black"
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Save and Publish"}
                </button>
              </div>
            </form>
          )}

          {/* COURSE LIST */}
          <div className="grid grid-cols-1 gap-4">
            {myCourses.length > 0 ? (
              myCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-blue-200 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {course.students?.length || 0} Students Enrolled
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to={`/instructor/course/${course.id}/lessons`}
                      className="flex-1 sm:flex-none text-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit Lessons
                    </Link>
                    <button
                      onClick={() => setSelectedCourseAnalytics(course)}
                      className="flex-1 sm:flex-none text-center px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">
                  You haven't created any courses yet.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;
