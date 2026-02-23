import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const InstructorDashboard = ({ courses, setCourses }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters the courses to show only yours
  const myCourses = courses.filter((c) => c.teacher_name === "admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/courses/",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Add the new course to our local state so it appears immediately
      setCourses([...courses, response.data]);

      // Reset the form
      setFormData({ title: "", description: "" });
      setShowForm(false);
      alert("Course created successfully! 🎓");
    } catch (error) {
      console.error("Error creating course:", error.response?.data);
      alert("Failed to create course. Check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Instructor Portal
          </h1>
          <p className="text-slate-500">
            Manage your content and track student engagement.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          {showForm ? "Cancel" : "+ Create New Course"}
        </button>
      </div>

      {/* CREATION FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
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
                isSubmitting ? "bg-slate-400" : "bg-slate-900 hover:bg-black"
              }`}
            >
              {isSubmitting ? "Creating..." : "Save and Publish"}
            </button>
          </div>
        </form>
      )}

      {/* COURSE LIST (The part that was deleted) */}
      <div className="grid grid-cols-1 gap-4">
        {myCourses.length > 0 ? (
          myCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {course.students?.length || 0} Students Enrolled
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/instructor/course/${course.id}/lessons`}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit Lessons
                </Link>
                <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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
    </div>
  );
};

export default InstructorDashboard;
