"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircle,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  ShieldCheck,
  Edit,
  Sparkles,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Clock,
  X,
  MapPin,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModal, setEditModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [designationInput, setDesignationInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      let empData = null;

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("employee") || localStorage.getItem("user");
        if (stored) {
          try {
            empData = JSON.parse(stored);
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (!empData || !empData.name) {
        const res = await axios.get("http://localhost:5000/api/Employee").catch(() => null);
        if (res?.data?.data?.length > 0) {
          empData = res.data.data[0];
        }
      }

      const p = {
        name: empData?.name || empData?.fullName || "Kamal Kumar",
        email: empData?.email || "kamal@odizocrm.com",
        phone: empData?.phone || "+91 98765 43210",
        employeeId: empData?.employeeid || empData?.employeeId || "EMP001",
        designation: empData?.designation || "Software Engineer",
        department: empData?.department || "Engineering & Development",
        location: empData?.location || "Headquarters (New Delhi)",
        joiningDate: empData?.joiningDate || "15 Jan 2024",
        status: "Active",
      };

      setProfile(p);
      setNameInput(p.name);
      setPhoneInput(p.phone);
      setDesignationInput(p.designation);
      setDepartmentInput(p.department);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: nameInput,
      phone: phoneInput,
      designation: designationInput,
      department: departmentInput,
    };
    setProfile(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("employee", JSON.stringify(updated));
    }

    setEditModal(false);
    setSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const getInitials = (str) => {
    if (!str) return "E";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return str[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Fetching employee profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-xl border-2 border-cyan-400/30 shrink-0">
              {getInitials(profile?.name)}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-0.5 text-[11px] font-bold text-cyan-300 mb-1.5">
                <ShieldCheck size={12} />
                <span>ID: {profile?.employeeId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile?.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {profile?.designation} • {profile?.department}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Edit size={16} />
            <span>Edit Profile Info</span>
          </button>
        </div>
      </div>

      {/* TOAST */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PROFILE DETAILS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN - CONTACT & INFO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCircle size={18} className="text-cyan-600" />
              <span>Contact Information</span>
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Email Address</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span>{profile?.email}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Phone Number</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>{profile?.phone}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Office Location</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{profile?.location}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Date of Joining</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{profile?.joiningDate}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - WORK METRICS AND SUMMARY */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-cyan-600" />
              <span>Employment & Department Overview</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Designation</span>
                <h4 className="text-base font-black text-slate-800 mt-1">{profile?.designation}</h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Core Technical Staff</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Department</span>
                <h4 className="text-base font-black text-slate-800 mt-1">{profile?.department}</h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Odizo Tech Team</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 mb-3 tracking-wider">
                Work Summary & Achievements
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                  <span className="text-xl font-black text-cyan-700 block">12</span>
                  <span className="text-[10px] font-bold text-cyan-600">Projects Completed</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <span className="text-xl font-black text-indigo-700 block">48</span>
                  <span className="text-[10px] font-bold text-indigo-600">Tasks Closed</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xl font-black text-emerald-700 block">99.4%</span>
                  <span className="text-[10px] font-bold text-emerald-600">On-Time Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-slate-800 tracking-tight">Edit Profile Info</h3>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  value={designationInput}
                  onChange={(e) => setDesignationInput(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
