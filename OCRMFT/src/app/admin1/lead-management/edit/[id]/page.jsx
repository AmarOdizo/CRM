"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import LeadForm from "../../leadcomponents/LeadForm";
import { getLeadById, updateLead } from "../../data";

export default function EditLead() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    businessRequirement: "",
    estimatedBudget: "",
    leadSource: "",
    status: "New",
    followUpDate: "",
    assignedEmployee: "",
    notes: "",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadById(id);

        setFormData({
          clientName: data.client?.clientName || data.clientName || "",
          companyName: data.companyName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          businessRequirement: data.businessRequirement || "",
          estimatedBudget: data.estimatedBudget || "",
          leadSource: data.leadSource || "",
          status: data.status || "New",
          followUpDate: data.followUpDate || "",
          assignedEmployee: data.assignedEmployee || "",
          notes: data.notes || "",
        });
      } catch (error) {
        console.error(error);
        alert("Lead Not Found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateLead(id, formData);

      alert("Lead Updated Successfully");

      router.push("/admin1/lead-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Lead</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">Update lead information and status logs.</p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      <LeadForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={saving ? "Updating..." : "Update Lead"}
      />
    </div>
  );
}
