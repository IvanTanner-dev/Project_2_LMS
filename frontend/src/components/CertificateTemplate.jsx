import React from "react";

const CertificateTemplate = ({ id, studentName, courseTitle }) => {
  const today = new Date().toLocaleDateString();

  return (
    <div
      id={id}
      style={{
        width: "800px",
        height: "600px",
        padding: "40px",
        backgroundColor: "#ffffff",
        border: "20px solid #1e293b",
        fontFamily: "serif",
        position: "absolute",
        left: "-9999px",
        top: "0",
        boxSizing: "border-box",
        display: "flex", // Force flex on the main container
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "5px solid #3b82f6",
          width: "100%", // Explicit width
          height: "100%", // Explicit height
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center", // Center everything horizontally
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Upper Content */}
        <div style={{ width: "100%" }}>
          <h1 style={{ fontSize: "42px", color: "#1e293b", margin: "10px 0" }}>
            Certificate of Completion
          </h1>
          <p
            style={{
              fontSize: "18px",
              fontStyle: "italic",
              color: "#64748b",
              margin: "5px 0",
            }}
          >
            This is to certify that
          </p>

          <div style={{ margin: "20px 0" }}>
            <h2
              style={{
                fontSize: "48px",
                color: "#3b82f6",
                margin: "0",
                paddingBottom: "5px",
              }}
            >
              {studentName}
            </h2>
            <div
              style={{
                width: "200px",
                height: "2px",
                backgroundColor: "#e2e8f0",
                margin: "0 auto",
              }}
            ></div>
          </div>

          <p style={{ fontSize: "18px", color: "#64748b", margin: "10px 0" }}>
            has successfully completed the course
          </p>
          <h3
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1e293b",
              margin: "0",
            }}
          >
            {courseTitle}
          </h3>
        </div>

        {/* Footer Content */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 20px",
          }}
        >
          {/* Date Side */}
          <div style={{ width: "200px", textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #94a3b8",
                width: "100%",
                marginBottom: "8px",
              }}
            ></div>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
              Date: {today}
            </p>
          </div>

          {/* Signature Side */}
          <div style={{ width: "250px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "24px",
                fontStyle: "italic",
                color: "#1e293b",
                margin: "0",
                paddingBottom: "8px", // 👈 This pushes the text UP off the line
                fontFamily: "serif",
                lineHeight: "1",
              }}
            >
              Gemini LMS
            </p>
            <div
              style={{
                borderTop: "1px solid #94a3b8",
                width: "100%",
                marginBottom: "8px",
              }}
            ></div>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: "0",
                fontWeight: "bold",
                uppercase: "true",
              }}
            >
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
