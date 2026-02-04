import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // We use the 'enrolled' endpoint we discussed earlier
        const response = await axios.get(
          "http://127.0.0.1:8000/api/courses/enrolled/",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching enrolled courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading)
    return <div className="p-10 text-slate-500">Loading your classroom...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-500">
          You have {courses.length} active courses in progress.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 mb-4">
            You haven't joined any courses yet.
          </p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">
            Browse the Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            /* Reusing your card UI logic here */
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {course.title}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>{course.progress_percentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-700"
                    style={{ width: `${course.progress_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
              <Link
                to={`/course/${course.id}`}
                className="mt-6 block text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
