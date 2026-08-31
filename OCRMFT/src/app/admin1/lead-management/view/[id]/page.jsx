"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  IndianRupee,
  User,
  Building,
  FileText
} from "lucide-react";

import StatusBadge from "../../leadcomponents/StatusBadge";
import { getLeadById } from "../../data";

export default function ViewLead() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLead = async () => {
    try {
      const data = await getLeadById(id);
      setLead(data);
    } catch (error) {
      console.log(error);
      alert("Lead Not Found");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLead();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Lead...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve lead profile.</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center max-w-sm">
          <h2 className="text-2xl font-black text-rose-600">Lead Not Found</h2>
          <p className="text-slate-400 text-sm mt-2 mb-6">The business lead profile does not exist or may have been deleted.</p>
          <Link
            href="/admin1/lead-management"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Management</span>
          </Link>
        </div>
      </div>
    );
  }

  const clientName = lead.client?.clientName || lead.clientName || "Unassigned Client";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Lead Details</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">Complete details of potential business lead client.</p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden h-fit">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>
          
          <div className="px-6 pb-6 relative flex flex-col items-center -mt-16 text-center border-b border-slate-100">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-md overflow-hidden shrink-0">
              {initials}
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-800 tracking-tight">{clientName}</h2>
            <p className="text-sm font-bold text-blue-600 mt-1 flex items-center gap-1">
              <Building size={14} />
              <span>{lead.companyName}</span>
            </p>
            <div className="mt-4">
              <StatusBadge status={lead.status} />
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="font-semibold text-slate-700 mt-0.5">{lead.email || "-"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                <span className="font-semibold text-slate-700 mt-0.5">{lead.phone || "-"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</span>
                <span className="font-semibold text-slate-700 mt-0.5 leading-tight">{lead.address || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Estimated Budget", val: lead.estimatedBudget || "-", icon: IndianRupee, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Lead Source", val: lead.leadSource || "-", icon: Layers, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { label: "Assigned To", val: lead.assignedEmployee || "-", icon: User, color: "text-purple-600 bg-purple-50 border-purple-100" },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${metric.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5 truncate">{metric.val}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Business Requirement Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Business Requirement</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {lead.businessRequirement || "No requirements recorded for this lead profile."}
            </div>
          </div>

          {/* Remarks/Notes Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Layers size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Additional Remarks & Notes</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {lead.notes || "No notes available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
