"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import UserForm from "../usercomponents/UserForm";
import { addUser } from "../data";

export default function AddUser() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "",
    status: "Active",
    joiningDate: "",
    address: "",
    profileImage: "",
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

      await addUser(formData);

      alert("User Added Successfully");

      router.push("/admin1/user-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add New User</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Fill in the information below to create a new user profile.
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

      {/* Form */}
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Saving..." : "Add User"}
      />
    </div>
  );
}
