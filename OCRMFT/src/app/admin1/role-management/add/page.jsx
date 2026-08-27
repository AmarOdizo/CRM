"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import RoleForm from "../rolecomponents/RoleForm";
import { addRole } from "../data";

export default function AddRole() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    roleName: "",
    roleCode: "",
    department: "",
    description: "",
    permissions: [],
    status: "Active",
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

      await addRole(formData);

      alert("Role Added Successfully");

      router.push("/admin1/role-management");
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
          <h1 className="text-3xl font-bold text-slate-800">Add New Role</h1>

          <p className="mt-2 text-slate-500">
            Create a new role and assign permissions.
          </p>
        </div>

        <Link
          href="/admin1/role-management"
          className="rounded-xl bg-gray-700 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      <RoleForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Saving..." : "Add Role"}
      />
    </div>
  );
}
