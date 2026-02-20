import React, { useState } from "react";
import CourseCard from "../components/Coursecard";
import Analytics from "../components/Analytics";

const Dashboard = ({ courses, onEnroll, studentName }) => {
  const [searchQuery, setSearchQuery] = useState(""); // 2. Tracking search
  // 3. Filter the master list based on search
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const enrolledCourses = filteredCourses.filter(
    (course) => course.is_enrolled,
  );
  const availableCourses = filteredCourses.filter(
    (course) => !course.is_enrolled,
  );

  return (
    <div className="space-y-12">
      {/* 🔍 SEARCH BAR SECTION */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-slate-400">🔍</span>
        </div>
        <input
          type="text"
          id="course-search"
          aria-label="Search courses"
          placeholder="Search your courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
        />
      </div>

      {/* ANALYTICS SECTION (Added here) */}
      {courses.length > 0 && <Analytics courses={courses} />}

      {/* SECTION 1: MY LEARNING */}
      {enrolledCourses.length > 0 && (
        <section>
          <h1 className="text-3xl font-black text-slate-900 mb-6">
            My Learning
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={true}
                studentName={studentName}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: BROWSE CATALOG */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Browse Catalog
        </h2>
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={false}
                onEnroll={onEnroll}
                studentName={studentName}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">No matches in the catalog.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
