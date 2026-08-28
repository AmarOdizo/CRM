"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import UserForm from "../../usercomponents/UserForm";
import { getUserById, updateUser } from "../../data";

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);

        setFormData({
          fullName: data.fullName || "",
          employeeId: data.employeeId || "",
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          designation: data.designation || "",
          role: data.role || "",
          status: data.status || "Active",
          joiningDate: data.joiningDate || "",
          address: data.address || "",
          profileImage: data.profileImage || "",
          notes: data.notes || "",
        });
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

      await updateUser(id, formData);

      alert("User Updated Successfully");

      router.push("/admin1/user-management");
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
          <h2 className="text-lg font-bold text-slate-700">Loading User...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve profile details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit User</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">Update user profile information.</p>
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
        buttonText={saving ? "Updating..." : "Update User"}
      />
    </div>
  );
}
