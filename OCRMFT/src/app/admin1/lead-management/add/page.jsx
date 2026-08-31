"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import LeadForm from "../leadcomponents/LeadForm";
import { addLead } from "../data";

export default function AddLead() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addLead(formData);

      alert("Lead Added Successfully");

      router.push("/admin1/lead-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add New Lead</h1>
          <p className="mt-1 text-slate-500 font-medium">Create a new potential client lead profile.</p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Form */}
      <LeadForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Saving..." : "Add Lead"}
      />
    </div>
  );
}
