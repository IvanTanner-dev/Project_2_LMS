import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams(); // Grabs the '1' out of /course/1
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/courses/${id}/`,
        );
        setCourse(response.data);
      } catch (err) {
        console.error("Could not find course details", err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!course) return <div className="p-8">Loading course details...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-64 bg-slate-800 flex items-center justify-center text-white">
          <h1 className="text-4xl font-bold">{course.title}</h1>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">Course Content</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  {index + 1}
                </div>
                <span className="font-medium">{lesson.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
