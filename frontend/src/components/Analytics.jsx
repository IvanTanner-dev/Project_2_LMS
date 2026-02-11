import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const Analytics = ({ courses }) => {
  // 1. Map the progress using the correct key: progress_percentage
  const progressData = courses.map((course) => ({
    name: course.title.substring(0, 8),
    // Use the exact key from your console log
    progress: Number(course.progress_percentage) || 0,
  }));

  // 2. Filter using the exact key: is_enrolled
  const completed = courses.filter(
    (c) => Number(c.progress_percentage) === 100,
  ).length;
  const inProgress = courses.filter(
    (c) => c.is_enrolled && Number(c.progress_percentage) < 100,
  ).length;
  const available = courses.filter((c) => !c.is_enrolled).length;

  const pieData = [
    { name: "Completed", value: completed, color: "#10B981" },
    { name: "In Progress", value: inProgress, color: "#6366F1" },
    { name: "Available", value: available, color: "#94A3B8" },
  ];
  console.log("Pie Data Check:", pieData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* 📊 BAR CHART CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 w-full">
          Course Mastery
        </h3>
        {/* REMOVED ResponsiveContainer - Using fixed width for testing */}
        <BarChart width={350} height={250} data={progressData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F1F5F9"
          />
          <XAxis
            dataKey="name"
            fontSize={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis domain={[0, 100]} hide />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
          <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </div>

      {/* 🥧 PIE CHART CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 w-full text-center">
          Learning Distribution
        </h3>

        {/* Add a min-height to the wrapper just in case */}
        <div
          style={{
            width: "100%",
            height: 250,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              cx="50%" // Explicitly center horizontally
              cy="50%" // Explicitly center vertically
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              stroke="none"
              isAnimationActive={false} // Disable animation to debug if it's a rendering lag issue
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
