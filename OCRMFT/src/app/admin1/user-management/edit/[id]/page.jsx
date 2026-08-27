"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading User...
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
          <h1 className="text-3xl font-bold text-slate-800">Edit User</h1>

          <p className="mt-2 text-slate-500">Update user information.</p>
        </div>

        <Link
          href="/admin1/user-management"
          className="rounded-xl bg-gray-700 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          ← Back
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
