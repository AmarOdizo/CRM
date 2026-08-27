"use client";

const cards = [
  {
    key: "totalLeads",
    title: "Total Leads",
    color: "bg-blue-500",
  },
  {
    key: "totalClients",
    title: "Clients",
    color: "bg-green-500",
  },
  {
    key: "totalProjects",
    title: "Projects",
    color: "bg-purple-500",
  },
  {
    key: "totalEmployees",
    title: "Employees",
    color: "bg-orange-500",
  },
  {
    key: "activeProjects",
    title: "Active Projects",
    color: "bg-cyan-500",
  },
  {
    key: "completedProjects",
    title: "Completed",
    color: "bg-emerald-500",
  },
  {
    key: "pendingProjects",
    title: "Pending",
    color: "bg-red-500",
  },
  {
    key: "totalRevenue",
    title: "Revenue",
    color: "bg-indigo-500",
  },
];

export default function StatisticsCards({ summary }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className={`mb-4 h-12 w-12 rounded-xl ${card.color}`}></div>

          <h3 className="text-sm text-gray-500">{card.title}</h3>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {summary?.[card.key] || 0}
          </p>
        </div>
      ))}
    </div>
  );
}
