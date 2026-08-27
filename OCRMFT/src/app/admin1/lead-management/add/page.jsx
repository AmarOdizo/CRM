"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add New Lead</h1>

          <p className="mt-2 text-slate-500">Create a new lead for your CRM.</p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
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
