import React from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import CertificateTemplate from "./CertificateTemplate";
import html2canvas from "html2canvas";

const CourseCard = ({ course, isEnrolled, onEnroll }) => {
  const isCompleted = course.progress_percentage === 100;
  const enrolledStatus = isEnrolled ?? course.is_enrolled;
  const downloadCertificate = async () => {
    const element = document.getElementById(`cert-${course.id}`);

    // 1. Create a clean, temporary window/div for the capture
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    // Force a standard color on the container to overwrite oklch inheritance
    container.style.color = "#000000";
    container.style.backgroundColor = "#ffffff";

    // 2. Clone the certificate into this "clean" container
    const clone = element.cloneNode(true);
    clone.style.left = "0"; // Reset position for the capture
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      // 3. Capture only the clean container
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        // This is the magic: ignore all outside styles
        onclone: (clonedDoc) => {
          const cert = clonedDoc.getElementById(`cert-${course.id}`);
          if (cert) cert.style.left = "0";
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
      pdf.save(`${course.title}-Certificate.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
    } finally {
      // 4. Cleanup
      document.body.removeChild(container);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
          {course.level || "Beginner"}
        </span>

        {enrolledStatus && (
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 text-[10px] font-black uppercase">
                🏆 Completed
              </span>
            ) : (
              <span className="text-green-500 text-[10px] font-bold flex items-center gap-1 uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            )}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition">
        {course.title}
      </h3>

      <div className="flex-1">
        {enrolledStatus ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Progress</span>
              <span>{course.progress_percentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${isCompleted ? "bg-emerald-500" : "bg-blue-600"}`}
                style={{ width: `${course.progress_percentage || 0}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      {enrolledStatus ? (
        <div className="space-y-3 mt-6">
          {" "}
          {/* Added a wrapper for spacing */}
          {/* 🏆 THE NEW BIT */}
          {isCompleted && (
            <>
              <CertificateTemplate
                id={`cert-${course.id}`}
                studentName="Ivan"
                courseTitle={course.title}
              />
              <button
                onClick={downloadCertificate}
                className="w-full py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
              >
                🏆 Download Certificate
              </button>
            </>
          )}
          <Link
            to={`/course/${course.id}`}
            className={`block text-center py-2 rounded-xl text-sm font-bold transition no-underline ${
              isCompleted
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isCompleted ? "Review Course" : "Continue Learning"}
          </Link>
        </div>
      ) : (
        <button
          onClick={() => onEnroll(course.id)}
          className="mt-6 w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

export default CourseCard;
