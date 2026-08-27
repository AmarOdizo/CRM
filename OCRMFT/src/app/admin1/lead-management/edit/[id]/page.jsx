"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
          clientName: data.client.clientName || "",
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
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Edit Lead</h1>

          <p className="mt-2 text-slate-500">Update lead information.</p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
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
