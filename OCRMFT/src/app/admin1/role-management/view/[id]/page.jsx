"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Briefcase,
  Key,
  ShieldCheck,
  Calendar,
  FileText
} from "lucide-react";

import { getRoleById } from "../../data";
import StatusBadge from "../../rolecomponents/StatusBadge";

export default function ViewRole() {
  const { id } = useParams();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const data = await getRoleById(id);
      setRole(data);
    } catch (error) {
      console.log(error);
      alert("Role Not Found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Role...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve role configuration.</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center max-w-sm">
          <h2 className="text-2xl font-black text-rose-600">Role Not Found</h2>
          <p className="text-slate-400 text-sm mt-2 mb-6">The system role you are trying to view does not exist or may have been deleted.</p>
          <Link
            href="/admin1/role-management"
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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Role Details</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Detailed role description and module level permissions.
          </p>
        </div>

        <Link
          href="/admin1/role-management"
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
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>
          {/* Avatar & Basic Info */}
          <div className="px-6 pb-6 relative flex flex-col items-center -mt-16 text-center border-b border-slate-100">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-md overflow-hidden shrink-0">
              <Shield size={44} />
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-800 tracking-tight">{role.roleName}</h2>
            <p className="text-sm font-bold text-blue-600 mt-1">{role.roleCode}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{role.department}</p>
            <div className="mt-4">
              <StatusBadge status={role.status} />
            </div>
          </div>
          {/* Quick Info Grid */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Role Code</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded text-xs">{role.roleCode}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Department</span>
              <span className="font-semibold text-slate-700">{role.department || "-"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Created Date</span>
              <span className="font-semibold text-slate-700">
                {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card - Description and Permissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Role Description</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {role.description || "No description recorded for this system role."}
            </div>
          </div>

          {/* Permissions Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
              <Key size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Assigned Module Permissions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {role.permissions?.length > 0 ? (
                role.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl bg-blue-50/50 border border-blue-100/50 px-4 py-3 text-sm font-bold text-blue-700 shadow-sm"
                  >
                    <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                    <span>{permission}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm font-semibold md:col-span-3">No Permissions Assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
