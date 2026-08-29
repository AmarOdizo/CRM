"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { UserPlus, UserCheck, RefreshCw } from "lucide-react";
import UserForm from "./UserForm";
import { getUserById, addUser, updateUser } from "../data";

export default function UserFormModal({ open, userId, onClose, onSuccess }) {
  const isEditMode = Boolean(userId);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const data = await getUserById(userId);
        setFormData({
          fullName: data?.fullName || "",
          employeeId: data?.employeeId || "",
          email: data?.email || "",
          phone: data?.phone || "",
          department: data?.department || "",
          designation: data?.designation || "",
          role: data?.role || "",
          status: data?.status || "Active",
          joiningDate: data?.joiningDate || "",
          address: data?.address || "",
          profileImage: data?.profileImage || "",
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchUser();
    } else {
      setFormData({
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
      setLoading(false);
    }
  }, [open, userId, isEditMode]);

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
        await updateUser(userId, formData);
        alert("User Updated Successfully");
      } else {
        await addUser(formData);
        alert("User Added Successfully");
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
            <UserCheck className="text-emerald-500 animate-pulse" size={18} />
          ) : (
            <UserPlus className="text-blue-500 animate-pulse" size={18} />
          )}
          <span className="font-extrabold text-lg">
            {isEditMode ? "Edit User Profile" : "Register New User"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      centered
      className="user-form-modal"
      maskStyle={{ backdropFilter: "blur(4px)" }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading user profile details...</p>
          </div>
        ) : (
          <UserForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Register User"}
          />
        )}
      </div>
    </Modal>
  );
}
