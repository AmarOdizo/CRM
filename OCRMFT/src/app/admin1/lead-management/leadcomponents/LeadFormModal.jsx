"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { UserPlus, UserCheck } from "lucide-react";
import LeadForm from "./LeadForm";
import { getLeadById, addLead, updateLead } from "../data";

export default function LeadFormModal({ open, leadId, onClose, onSuccess }) {
  const isEditMode = Boolean(leadId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    source: "Website",
    status: "New",
    value: "",
    requirement: "",
    notes: "",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await getLeadById(leadId);
        setFormData({
          clientId: data?.clientId || "",
          source: data?.source || "Website",
          status: data?.status || "New",
          value: data?.value || "",
          requirement: data?.requirement || "",
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch lead:", error);
        alert("Failed to load lead details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchLead();
    } else {
      setFormData({
        clientId: "",
        source: "Website",
        status: "New",
        value: "",
        requirement: "",
        notes: "",
      });
      setLoading(false);
    }
  }, [open, leadId, isEditMode]);

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
        await updateLead(leadId, formData);
        alert("Lead Updated Successfully");
      } else {
        await addLead(formData);
        alert("Lead Added Successfully");
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
            {isEditMode ? "Edit Lead Profile" : "Register New Lead"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      centered
      className="lead-form-modal"
      maskStyle={{ backdropFilter: "blur(4px)" }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading lead profile details...</p>
          </div>
        ) : (
          <LeadForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Register Lead"}
          />
        )}
      </div>
    </Modal>
  );
}
