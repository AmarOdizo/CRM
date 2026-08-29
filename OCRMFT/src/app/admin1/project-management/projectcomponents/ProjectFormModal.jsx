"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { PlusCircle, FileEdit } from "lucide-react";
import ProjectForm from "./ProjectForm";
import { getProjectById, addProject, updateProject } from "../data";

export default function ProjectFormModal({ open, projectId, onClose, onSuccess }) {
  const isEditMode = Boolean(projectId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    clientId: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    priority: "Medium",
    budget: "",
    notes: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(projectId);
        setFormData({
          projectName: data?.projectName || "",
          clientId: data?.clientId || "",
          description: data?.description || "",
          startDate: data?.startDate || "",
          endDate: data?.endDate || "",
          status: data?.status || "Planning",
          priority: data?.priority || "Medium",
          budget: data?.budget || "",
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch project:", error);
        alert("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchProject();
    } else {
      setFormData({
        projectName: "",
        clientId: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Planning",
        priority: "Medium",
        budget: "",
        notes: "",
      });
      setLoading(false);
    }
  }, [open, projectId, isEditMode]);

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
        await updateProject(projectId, formData);
        alert("Project Updated Successfully");
      } else {
        await addProject(formData);
        alert("Project Added Successfully");
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
            {isEditMode ? "Edit Project Details" : "Create New Project"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      centered
      className="project-form-modal"
      maskStyle={{ backdropFilter: "blur(4px)" }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading project details...</p>
          </div>
        ) : (
          <ProjectForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Create Project"}
          />
        )}
      </div>
    </Modal>
  );
}
