"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { UserPlus, UserCheck } from "lucide-react";
import ClientForm from "./ClientForm";
import { getClientById, addClient, updateClient } from "../data";

export default function ClientFormModal({ open, clientId, onClose, onSuccess }) {
  const isEditMode = Boolean(clientId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    website: "",
    clientType: "Direct",
    status: "Active",
    assignedEmployee: "",
    notes: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await getClientById(clientId);
        setFormData({
          clientName: data?.clientName || "",
          companyName: data?.companyName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          address: data?.address || "",
          industry: data?.industry || "",
          website: data?.website || "",
          clientType: data?.clientType || "Direct",
          status: data?.status || "Active",
          assignedEmployee: data?.assignedEmployee || "",
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch client:", error);
        alert("Failed to load client details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchClient();
    } else {
      setFormData({
        clientName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        industry: "",
        website: "",
        clientType: "Direct",
        status: "Active",
        assignedEmployee: "",
        notes: "",
      });
      setLoading(false);
    }
  }, [open, clientId, isEditMode]);

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
        await updateClient(clientId, formData);
        alert("Client Updated Successfully");
      } else {
        await addClient(formData);
        alert("Client Added Successfully");
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
            {isEditMode ? "Edit Client Profile" : "Register New Client"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
      centered
      className="client-form-modal"
      styles={{ mask: { backdropFilter: "blur(4px)" } }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading client profile details...</p>
          </div>
        ) : (
          <ClientForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Register Client"}
          />
        )}
      </div>
    </Modal>
  );
}
