"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import RoleForm from "../../rolecomponents/RoleForm";
import { getRoleById, updateRole } from "../../data";

export default function EditRole() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    roleName: "",
    roleCode: "",
    department: "",
    description: "",
    permissions: [],
    status: "Active",
  });

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const data = await getRoleById(id);

      setFormData({
        roleName: data.roleName || "",
        roleCode: data.roleCode || "",
        department: data.department || "",
        description: data.description || "",
        permissions: data.permissions || [],
        status: data.status || "Active",
      });
    } catch (error) {
      console.log(error);
      alert("Role Not Found");
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

      await updateRole(id, formData);

      alert("Role Updated Successfully");

      router.push("/admin1/role-management");
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
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading Role...
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
          <h1 className="text-3xl font-bold text-slate-800">Edit Role</h1>

          <p className="mt-2 text-slate-500">
            Update role information and permissions.
          </p>
        </div>

        <Link
          href="/admin1/role-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      <RoleForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={saving ? "Updating..." : "Update Role"}
      />
    </div>
  );
}
