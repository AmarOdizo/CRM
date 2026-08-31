"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  Video,
  MapPin,
  PhoneCall,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { isMeetingExpired } from "@/app/admin1/meeting/utils";

export default function EmployeeMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Current logged in employee profile
  const [employeeProfile, setEmployeeProfile] = useState(null);

  useEffect(() => {
    // 1. Read logged in employee session
    if (typeof window !== "undefined") {
      const storedEmp = localStorage.getItem("employee") || localStorage.getItem("user");
      if (storedEmp) {
        try {
          const parsed = JSON.parse(storedEmp);
          setEmployeeProfile({
            name: parsed.name || parsed.fullName || "Kamal Kumar",
            email: parsed.email || "kamal@odizocrm.com",
            employeeId: parsed.employeeid || parsed.employeeId || "EMP001",
          });
        } catch (e) {
          console.error("Session error:", e);
        }
      } else {
        // Fallback default employee
        setEmployeeProfile({
          name: "Kamal Kumar",
          email: "kamal@odizocrm.com",
          employeeId: "EMP001",
        });
      }
    }
  }, []);

  // 2. Fetch meetings from API and filter for this specific employee
  useEffect(() => {
    async function fetchEmployeeMeetings() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:5000/api/Meeting");
        const allMeetings = Array.isArray(res.data?.data) ? res.data.data : [];

        setMeetings(allMeetings);
      } catch (err) {
        console.error("Fetch meetings error:", err);
        setError("Failed to load meetings schedule.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeMeetings();
  }, []);

  const empNameLower = (employeeProfile?.name || "").toLowerCase();
  const empEmailLower = (employeeProfile?.email || "").toLowerCase();

  // Filter meetings that belong to or include this employee
  const myMeetings = meetings.filter((mtg) => {
    if (!mtg.participants || !Array.isArray(mtg.participants) || mtg.participants.length === 0) {
      return true; // Show general meetings if no participants restricted
    }
    return mtg.participants.some((p) => {
      const pName = (p.name || "").toLowerCase();
      const pEmail = (p.email || "").toLowerCase();
      return (
        (empNameLower && pName.includes(empNameLower)) ||
        (empEmailLower && pEmail.includes(empEmailLower)) ||
        (pName && empNameLower.includes(pName))
      );
    });
  });

  // Apply search & status filters
  const filteredMeetings = myMeetings.filter((mtg) => {
    const isExpired = isMeetingExpired(mtg.meetingDate, mtg.endTime);
    const matchesSearch =
      (mtg.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mtg.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "EXPIRED") return matchesSearch && isExpired;
    if (statusFilter === "ACTIVE") return matchesSearch && !isExpired && mtg.status !== "Cancelled";

    return matchesSearch && (mtg.status || "").toUpperCase() === statusFilter.toUpperCase();
  });

  // Stats calculation
  const totalCount = myMeetings.length;
  const activeCount = myMeetings.filter(
    (m) => !isMeetingExpired(m.meetingDate, m.endTime) && m.status !== "Cancelled"
  ).length;
  const expiredCount = myMeetings.filter((m) => isMeetingExpired(m.meetingDate, m.endTime)).length;

  const formatDate = (dStr) => {
    if (!dStr) return "-";
    const d = new Date(dStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>My Scheduled Meetings</span>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full">
              {employeeProfile?.name}
            </span>
          </h1>
          <p className="mt-1 text-slate-500 font-medium text-xs sm:text-sm">
            View your upcoming calendar sessions, video links, and expiration details after meeting end time.
          </p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Assigned</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalCount}</h3>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
            <CalendarDays size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Sessions</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{activeCount}</h3>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
            <Sparkles size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expired Meetings</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{expiredCount}</h3>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* CONTROLS (SEARCH & STATUS FILTER) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter meetings by title or topic..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-cyan-100"
          >
            <option value="ALL">All Meetings</option>
            <option value="ACTIVE">Active (Valid Link)</option>
            <option value="EXPIRED">Expired (After End Time)</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* MEETINGS LIST GRID */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
          <p className="mt-3 text-xs font-semibold text-slate-500">Loading your meeting schedule...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle size={24} className="mx-auto text-rose-500 mb-2" />
          <p className="text-xs font-bold text-rose-700">{error}</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <CalendarDays size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Meetings Found</h3>
          <p className="mt-1 text-xs text-slate-400">
            There are no meetings assigned to <span className="font-semibold text-slate-600">{employeeProfile?.name}</span> matching your filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((mtg) => {
            const expired = isMeetingExpired(mtg.meetingDate, mtg.endTime);

            return (
              <div
                key={mtg._id || mtg.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${
                  expired ? "border-slate-200/60 bg-slate-50/30" : "border-slate-200/80"
                }`}
              >
                <div>
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="min-w-0">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase mb-2 ${
                          expired
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : mtg.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : mtg.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                        }`}
                      >
                        {expired ? "Expired" : mtg.status}
                      </span>
                      <h3 className="text-base font-black text-slate-800 truncate leading-snug group-hover:text-cyan-600 transition-colors">
                        {mtg.title}
                      </h3>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                      {mtg.meetingType === "Online" ? (
                        <Video size={18} className={expired ? "text-slate-400" : "text-cyan-600"} />
                      ) : mtg.meetingType === "Phone" ? (
                        <PhoneCall size={18} className={expired ? "text-slate-400" : "text-emerald-600"} />
                      ) : (
                        <MapPin size={18} className={expired ? "text-slate-400" : "text-amber-600"} />
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  {mtg.description && (
                    <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {mtg.description}
                    </p>
                  )}

                  {/* DATE & TIME INFO */}
                  <div className="mt-4 space-y-2 text-xs font-semibold text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-400 shrink-0" />
                      <span>{formatDate(mtg.meetingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400 shrink-0" />
                      <span>
                        {mtg.startTime} - {mtg.endTime}
                      </span>
                    </div>
                    {mtg.meetingType === "Offline" && mtg.location && (
                      <div className="flex items-center gap-2 text-amber-700">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{mtg.location}</span>
                      </div>
                    )}
                  </div>

                  {/* PARTICIPANTS LIST */}
                  {Array.isArray(mtg.participants) && mtg.participants.length > 0 && (
                    <div className="mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Participants ({mtg.participants.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mtg.participants.map((p, idx) => {
                          const isMe =
                            (p.name || "").toLowerCase().includes(empNameLower) ||
                            (p.email || "").toLowerCase().includes(empEmailLower);
                          return (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                                isMe
                                  ? "bg-cyan-50 text-cyan-800 border-cyan-200 font-bold"
                                  : "bg-slate-50 text-slate-600 border-slate-100"
                              }`}
                            >
                              <User size={10} />
                              <span>{p.name}</span>
                              {isMe && <span className="text-[9px] text-cyan-600">(You)</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION FOOTER */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  {mtg.meetingType === "Online" && mtg.meetingLink ? (
                    expired ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed select-none"
                      >
                        <Clock size={14} className="text-slate-400" />
                        <span>Join Link Expired</span>
                      </button>
                    ) : (
                      <a
                        href={mtg.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <span>Join Online Meeting</span>
                        <ExternalLink size={14} />
                      </a>
                    )
                  ) : (
                    <div className="text-center text-xs font-semibold text-slate-400 py-1">
                      {mtg.meetingType === "Phone" ? "Phone Call Meeting" : "In-Person Venue Meeting"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
