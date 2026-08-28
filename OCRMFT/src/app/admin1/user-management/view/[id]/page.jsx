"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Award,
  ShieldCheck,
  Calendar,
  MapPin,
  FileText
} from "lucide-react";

import { getUserById } from "../../data";
import StatusBadge from "../../usercomponents/StatusBadge";

export default function ViewUser() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.log(error);
        alert("User Not Found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Profile...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve employee records.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center max-w-sm">
          <h2 className="text-2xl font-black text-rose-600">User Not Found</h2>
          <p className="text-slate-400 text-sm mt-2 mb-6">The employee you are trying to view does not exist or may have been deleted.</p>
          <Link
            href="/admin1/user-management"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Management</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Profile</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">
            Detailed profile information and system records.
          </p>
        </div>

        <Link
          href="/admin1/user-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Card - Quick Overview */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-650 relative"></div>
          {/* Avatar & Basic Info */}
          <div className="px-6 pb-6 relative flex flex-col items-center -mt-16 text-center border-b border-slate-100">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-md overflow-hidden shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.fullName ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"
              )}
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-800 tracking-tight">{user.fullName}</h2>
            <p className="text-sm font-semibold text-blue-600 mt-1">{user.designation}</p>
            <p className="text-xs text-slate-500 font-medium">{user.department}</p>
            <div className="mt-4">
              <StatusBadge status={user.status} />
            </div>
          </div>
          {/* Quick Info Grid */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Employee ID</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded text-xs">{user.employeeId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">System Role</span>
              <span className="font-semibold text-slate-700">{user.role || "-"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Joining Date</span>
              <span className="font-semibold text-slate-700">{user.joiningDate || "-"}</span>
            </div>
          </div>
        </div>

        {/* Right Card - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detail Fields Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-5">Employee Records</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailRow icon={Mail} label="Email Address" value={user.email} />
              <DetailRow icon={Phone} label="Phone Number" value={user.phone} />
              <DetailRow icon={Building} label="Department" value={user.department} />
              <DetailRow icon={Award} label="Designation" value={user.designation} />
              <DetailRow icon={ShieldCheck} label="Role Permissions" value={user.role} />
              <DetailRow icon={Calendar} label="Joining Date" value={user.joiningDate} />
              <div className="md:col-span-2">
                <DetailRow icon={MapPin} label="Office/Home Address" value={user.address} />
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Additional Notes</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {user.notes || "No additional remarks or notes recorded for this employee."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-slate-400 shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <span className="block mt-0.5 text-sm font-semibold text-slate-700 leading-normal">{value || "-"}</span>
      </div>
    </div>
  );
}
