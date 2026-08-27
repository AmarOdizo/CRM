"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import ClientForm from "../../clientcomponents/ClientForm";
import { getClientById, updateClient } from "../../data";

export default function EditClient() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    gstNumber: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    industry: "",
    clientType: "",
    status: "Active",
    assignedEmployee: "",
    notes: "",
  });

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const data = await getClientById(id);

      setFormData({
        clientName: data.clientName || "",
        companyName: data.companyName || "",
        email: data.email || "",
        phone: data.phone || "",
        alternatePhone: data.alternatePhone || "",
        gstNumber: data.gstNumber || "",
        website: data.website || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pincode: data.pincode || "",
        industry: data.industry || "",
        clientType: data.clientType || "",
        status: data.status || "Active",
        assignedEmployee: data.assignedEmployee || "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.log(error);
      alert("Client Not Found");
    } finally {
      setLoading(false);
    }
  };

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

      await updateClient(id, formData);

      alert("Client Updated Successfully");

      router.push("/admin1/client-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading Client...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Edit Client</h1>

          <p className="mt-2 text-slate-500">Update client information.</p>
        </div>

        <Link
          href="/admin1/client-management"
          className="rounded-xl bg-gray-700 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      <ClientForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={saving ? "Updating..." : "Update Client"}
      />
    </div>
  );
}
