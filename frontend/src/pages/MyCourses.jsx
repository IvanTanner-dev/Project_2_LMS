import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/Coursecard";
import api from "../api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/api/courses/enrolled/");
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
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Courses</h1>
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
            <CourseCard key={course.id} course={course} isEnrolled={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
