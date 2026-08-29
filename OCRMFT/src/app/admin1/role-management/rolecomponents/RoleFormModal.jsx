"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { PlusCircle, FileEdit } from "lucide-react";
import RoleForm from "./RoleForm";
import { getRoleById, addRole, updateRole } from "../data";

export default function RoleFormModal({ open, roleId, onClose, onSuccess }) {
  const isEditMode = Boolean(roleId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: [],
    notes: "",
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const data = await getRoleById(roleId);
        setFormData({
          roleName: data?.roleName || "",
          description: data?.description || "",
          permissions: data?.permissions || [],
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch role:", error);
        alert("Failed to load role details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchRole();
    } else {
      setFormData({
        roleName: "",
        description: "",
        permissions: [],
        notes: "",
      });
      setLoading(false);
    }
  }, [open, roleId, isEditMode]);

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
      if (isEditMode) {
        await updateRole(roleId, formData);
        alert("Role Updated Successfully");
      } else {
        await addRole(formData);
        alert("Role Added Successfully");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
          {isEditMode ? (
            <FileEdit className="text-emerald-500 animate-pulse" size={18} />
          ) : (
            <PlusCircle className="text-blue-500 animate-pulse" size={18} />
          )}
          <span className="font-extrabold text-lg">
            {isEditMode ? "Edit Role Details" : "Create New Role"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnHidden
      centered
      className="role-form-modal"
      styles={{ mask: { backdropFilter: "blur(4px)" } }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading role details...</p>
          </div>
        ) : (
          <RoleForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Create Role"}
          />
        )}
      </div>
    </Modal>
  );
}
