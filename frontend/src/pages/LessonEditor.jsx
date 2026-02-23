import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const LessonEditor = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    video_url: "",
    order: 1,
  });

  // 1. Fetch current lessons
  useEffect(() => {
    const fetchLessons = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/courses/${courseId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setLessons(res.data.lessons || []);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // 2. Handle adding a new lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/lessons/",
        {
          course: Number(courseId),
          title: newLesson.title,
          content: newLesson.content,
          order: lessons.length + 1,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLessons([...lessons, res.data]);
      setNewLesson({ title: "", content: "", video_url: "", order: 1 });
    } catch (err) {
      console.error("Error saving lesson:", err.response?.data);
    }
  };

  // 3. Handle deleting a lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/lessons/${lessonId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Link to="/instructor" className="text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-black text-slate-900">Manage Lessons</h1>

      {/* SINGLE LIST OF LESSONS */}
      <div className="space-y-4">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm">
                  {lesson.order}
                </span>
                <span className="font-semibold text-slate-800">
                  {lesson.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-400 italic text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed">
            No lessons added yet.
          </p>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* Form to add a lesson */}
      <form
        onSubmit={handleAddLesson}
        className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4"
      >
        <h3 className="font-bold text-slate-700">Add New Lesson</h3>
        <input
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Lesson Title"
          value={newLesson.title}
          onChange={(e) =>
            setNewLesson({ ...newLesson, title: e.target.value })
          }
          required
        />
        <textarea
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
          placeholder="Lesson Text Content"
          value={newLesson.content}
          onChange={(e) =>
            setNewLesson({ ...newLesson, content: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors"
        >
          Add Lesson
        </button>
      </form>
    </div>
  );
};

export default LessonEditor;
