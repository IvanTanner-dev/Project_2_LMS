import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ courses, onEnroll }) => {
  // Logic: In a real app, 'enrolled' might be a boolean from your API
  // For now, we'll simulate it or use data if your API provides it
  const enrolledCourses = courses.filter((course) => course.is_enrolled);
  const availableCourses = courses.filter((course) => !course.is_enrolled);

  return (
    <div className="space-y-12">
      {/* SECTION 1: MY LEARNING */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Learning</h2>
            <p className="text-slate-500 text-sm">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} isEnrolled={true} />
            ))
          ) : (
            <div className="col-span-full p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
              You haven't enrolled in any courses yet.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: BROWSE CATALOG */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Browse Catalog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            // 2. Pass the function down
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={false}
              onEnroll={onEnroll}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const CourseCard = ({ course, isEnrolled, onEnroll }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
        {course.level || "Beginner"}
      </span>
      {isEnrolled && (
        <span className="text-green-500 text-xs font-bold flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Active
        </span>
      )}
    </div>

    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
      {course.title}
    </h3>

    {isEnrolled ? (
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 text-slate-500">
          <span>Progress</span>
          <span>{course.progress || 0}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${course.progress || 0}%` }}
          ></div>
        </div>
        <Link
          to={`/course/${course.id}`}
          className="mt-4 block text-center py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition no-underline"
        >
          Continue Lesson
        </Link>
      </div>
    ) : (
      <div className="flex flex-col gap-2 mt-4">
        {/* 3. The Action Button! */}
        <button
          onClick={() => onEnroll(course.id)}
          className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          Join Course
        </button>
        <Link
          to={`/course/${course.id}`}
          className="block text-center py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition no-underline"
        >
          View Details
        </Link>
      </div>
    )}
  </div>
);

export default Dashboard;
