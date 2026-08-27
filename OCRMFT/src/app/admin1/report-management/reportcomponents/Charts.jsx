"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Charts({ summary = {} }) {
  const projectData = [
    {
      name: "Projects",
      Total: summary.totalProjects || 0,
      Active: summary.activeProjects || 0,
      Completed: summary.completedProjects || 0,
    },
  ];

  const statusData = [
    {
      name: "Completed",
      value: summary.completedProjects || 0,
    },
    {
      name: "Active",
      value: summary.activeProjects || 0,
    },
    {
      name: "Pending",
      value: summary.pendingProjects || 0,
    },
  ];

  const monthlyData = summary.monthlyReports || [
    { month: "Jan", reports: 12 },
    { month: "Feb", reports: 20 },
    { month: "Mar", reports: 15 },
    { month: "Apr", reports: 28 },
    { month: "May", reports: 35 },
    { month: "Jun", reports: 30 },
    { month: "Jul", reports: 45 },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Bar Chart */}

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-bold text-slate-700">
          Project Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="Total" fill="#2563eb" />

            <Bar dataKey="Active" fill="#22c55e" />

            <Bar dataKey="Completed" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-bold text-slate-700">
          Project Status
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}

      <div className="rounded-2xl bg-white p-6 shadow-lg xl:col-span-2">
        <h2 className="mb-5 text-xl font-bold text-slate-700">
          Monthly Reports
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="reports"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
