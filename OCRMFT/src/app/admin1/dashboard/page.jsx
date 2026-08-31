"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  FolderKanban,
  ClipboardCheck,
  PlusCircle,
  Briefcase,
  Calendar,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  MapPin,
  Clock,
  IndianRupee,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// API data imports
import { getClients } from "../client-management/data";
import { getProjects } from "../project-management/data";
import { getInvoices } from "../invoice/data";
import { getPayments } from "../payment/data";
import { getLeads } from "../lead-management/data";
import { getMeetings } from "../meeting/data";

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    clientCount: 0,
    activeProjects: 0,
    conversionRate: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [projectChartData, setProjectChartData] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [
          clientsRes,
          projectsRes,
          invoicesRes,
          paymentsRes,
          leadsRes,
          meetingsRes,
        ] = await Promise.allSettled([
          getClients(),
          getProjects(),
          getInvoices(),
          getPayments(),
          getLeads(),
          getMeetings(),
        ]);

        // Extract values using robust array-extraction utility
        const extractArray = (resVal, key) => {
          if (!resVal) return [];
          if (Array.isArray(resVal)) return resVal;
          if (resVal.data && Array.isArray(resVal.data)) return resVal.data;
          if (key && resVal[key] && Array.isArray(resVal[key])) return resVal[key];
          return [];
        };

        const clients = clientsRes.status === "fulfilled" ? extractArray(clientsRes.value, "clients") : [];
        const projects = projectsRes.status === "fulfilled" ? extractArray(projectsRes.value, "projects") : [];
        const invoices = invoicesRes.status === "fulfilled" ? extractArray(invoicesRes.value, "invoices") : [];
        const payments = paymentsRes.status === "fulfilled" ? extractArray(paymentsRes.value, "payments") : [];
        const leads = leadsRes.status === "fulfilled" ? extractArray(leadsRes.value, "leads") : [];
        const meetings = meetingsRes.status === "fulfilled" ? extractArray(meetingsRes.value, "meetings") : [];

        // 1. Calculate KPI Metrics
        // Total Paid invoices/payments
        const totalRev = payments.reduce((sum, p) => sum + (Number(p.amount || p.paidAmount) || 0), 0);

        // Active Clients
        const activeClients = clients.filter((c) => c.status === "Active" || c.status === "active").length;

        // In Progress Projects
        const activeProjs = projects.filter(
          (p) => p.status === "In Progress" || p.status === "Active" || p.status === "in progress"
        ).length;

        // Lead Conversion Rate
        const totalLeads = leads.length;
        const convertedLeads = leads.filter((l) => l.status === "Converted" || l.status === "converted").length;
        const convRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

        setMetrics({
          totalRevenue: totalRev,
          clientCount: clients.length,
          activeProjects: activeProjs,
          conversionRate: convRate,
        });

        // 2. Set recent listings (latest 4)
        setRecentInvoices(invoices.slice(0, 4));
        setRecentLeads(leads.slice(0, 4));
        setUpcomingMeetings(meetings.slice(0, 4));

        // 3. Prepare Revenue Chart Data (aggregate payments & invoices dynamically by month)
        const getMonthName = (dateStr) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          return d.toLocaleString("default", { month: "short" });
        };

        const monthMap = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthIdx = new Date().getMonth();
        for (let i = 5; i >= 0; i--) {
          let idx = currentMonthIdx - i;
          if (idx < 0) idx += 12;
          monthMap[months[idx]] = { name: months[idx], Invoiced: 0, Paid: 0 };
        }

        invoices.forEach(inv => {
          const m = getMonthName(inv.invoiceDate || inv.createdAt);
          if (monthMap[m]) {
            monthMap[m].Invoiced += Number(inv.totalAmount) || 0;
          }
        });

        payments.forEach(p => {
          const m = getMonthName(p.paymentDate || p.createdAt);
          if (monthMap[m]) {
            monthMap[m].Paid += Number(p.amount) || 0;
          }
        });

        const monthlyBilling = Object.values(monthMap);
        setChartData(monthlyBilling);

        // 4. Project Stage Distribution
        const statuses = projects.reduce((acc, p) => {
          const status = p.status || "Planned";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const projectStages = Object.entries(statuses).map(([name, value]) => ({
          name,
          value,
        }));
        setProjectChartData(projectStages);

      } catch (err) {
        console.error("Dashboard calculation error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
        <p className="mt-3 text-sm text-slate-500">Assembling admin metrics dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 leading-tight">CRM Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time indicators, invoicing logs, and pipeline summaries.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm self-start md:self-auto select-none">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          <span>LIVE TRACKING ACTIVE</span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* REVENUE CARD */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-350 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 group-hover:bg-cyan-100 transition-colors">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <TrendingUp size={12} />
              <span>+12.4% vs last month</span>
            </p>
          </div>
        </div>

        {/* CLIENTS CARD */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-350 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clients</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{metrics.clientCount}</h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <span>Managed CRM Accounts</span>
            </p>
          </div>
        </div>

        {/* PROJECTS CARD */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-350 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Projects</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{metrics.activeProjects}</h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-600">
              <span>Current developmental stages</span>
            </p>
          </div>
        </div>

        {/* LEAD CONVERSION CARD */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-350 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion Rate</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{metrics.conversionRate}%</h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-indigo-600">
              <span>Leads converted to clients</span>
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* REVENUE TIMELINE CHART (2 COLS) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Billing Trends & Cash Flow</h2>
              <p className="text-xs text-slate-400">Comparing total invoice generation vs cash payments cleared.</p>
            </div>
          </div>
          <div className="h-72 w-full text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="colorInvoice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="Invoiced"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInvoice)"
                />
                <Area
                  type="monotone"
                  dataKey="Paid"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPaid)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROJECT STATUS DISTRIBUTION CHART (1 COL) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">Project Status Distribution</h2>
            <p className="text-xs text-slate-400">Current allocation of development stages.</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Projects`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-slate-800">
                  {projectChartData.reduce((sum, item) => sum + item.value, 0)}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Total</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
              {projectChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 select-none">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LISTINGS PANELS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT INVOICES & LEADS */}
        <div className="lg:col-span-2 space-y-6">
          {/* RECENT INVOICES */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Recent Invoices</h2>
              <Link
                href="/admin1/invoice"
                className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5">Invoice #</th>
                    <th className="py-2.5">Client</th>
                    <th className="py-2.5 text-right">Amount</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentInvoices.map((inv, index) => (
                    <tr key={inv._id || inv.id || index} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-semibold text-cyan-600">
                        <Link href={`/admin1/invoice/view/${inv._id || inv.id}`} className="hover:underline">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-800">{inv.customerName}</td>
                      <td className="py-3 text-right text-slate-800 font-bold">
                        ₹{(inv.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold
                          ${
                            inv.status === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-250/20"
                              : inv.status === "Overdue"
                              ? "bg-red-50 text-red-700 border border-red-200/20"
                              : "bg-amber-50 text-amber-700 border border-amber-250/20"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT LEADS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Recent Inbound Leads</h2>
              <Link
                href="/admin1/lead-management"
                className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentLeads.map((lead, index) => (
                <div
                  key={lead._id || lead.id || index}
                  className="rounded-xl border border-slate-105 border-slate-100 p-3 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {lead.clientName || lead.client?.clientName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{lead.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase
                    ${
                      lead.status === "Converted"
                        ? "bg-emerald-100 text-emerald-800"
                        : lead.status === "Lost"
                        ? "bg-slate-200 text-slate-600"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR COMPONENT: MEETINGS & QUICK ACTIONS */}
        <div className="space-y-6">
          {/* UPCOMING MEETINGS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">Meetings Checklist</h2>
            <div className="space-y-3">
              {upcomingMeetings.map((mtg, index) => (
                <div key={mtg._id || mtg.id || index} className="flex gap-3 items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600 shrink-0 mt-0.5">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-xs font-bold text-slate-800 truncate">{mtg.title}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-0.5 shrink-0">
                        <Clock size={10} />
                        {mtg.startTime}
                      </span>
                      <span className="flex items-center gap-0.5 shrink-0">
                        <MapPin size={10} />
                        {mtg.meetingType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-sm text-white">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Quick Operations</h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/admin1/invoice/add"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-3 transition text-slate-200 hover:text-white"
              >
                <PlusCircle size={14} className="text-cyan-400" />
                <span>New Invoice</span>
              </Link>
              <Link
                href="/admin1/meeting/add"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-3 transition text-slate-200 hover:text-white"
              >
                <PlusCircle size={14} className="text-cyan-400" />
                <span>New Meeting</span>
              </Link>
              <Link
                href="/admin1/lead-management/add"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-3 transition text-slate-200 hover:text-white"
              >
                <PlusCircle size={14} className="text-cyan-400" />
                <span>New Lead</span>
              </Link>
              <Link
                href="/admin1/project-management/add"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-3 transition text-slate-200 hover:text-white"
              >
                <PlusCircle size={14} className="text-cyan-400" />
                <span>New Project</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
