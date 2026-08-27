"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ClientForm from "../clientcomponents/ClientForm";
import { addClient } from "../data";

export default function AddClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

      await addClient(formData);

      alert("Client Added Successfully");

      router.push("/admin1/client-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add New Client</h1>

          <p className="mt-2 text-slate-500">
            Fill in the details below to add a new client.
          </p>
        </div>

        <Link
          href="/admin1/client-management"
          className="rounded-xl bg-gray-700 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Form */}

      <ClientForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Saving..." : "Add Client"}
      />
    </div>
  );
}
