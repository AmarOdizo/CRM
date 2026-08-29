"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { ClipboardCopy, FileEdit } from "lucide-react";
import TaskForm from "./TaskForm";
import { getTaskById, createTask, updateTask } from "../data";

export default function TaskFormModal({ open, taskId, onClose, onSuccess }) {
  const isEditMode = Boolean(taskId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        // data contains .data
        const taskData = data?.data || data;
        setFormData({
          title: taskData?.title || "",
          description: taskData?.description || "",
          assignedTo: taskData?.assignedTo?._id || taskData?.assignedTo || "",
          projectId: taskData?.projectId || "",
          priority: taskData?.priority || "Medium",
          status: taskData?.status || "Pending",
          dueDate: taskData?.dueDate ? taskData.dueDate.slice(0, 10) : "",
          notes: taskData?.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch task:", error);
        alert("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchTask();
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        projectId: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
        notes: "",
      });
      setLoading(false);
    }
  }, [open, taskId, isEditMode]);

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
        await updateTask(taskId, formData);
        alert("Task Updated Successfully");
      } else {
        await createTask(formData);
        alert("Task Created Successfully");
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
            <ClipboardCopy className="text-blue-500 animate-pulse" size={18} />
          )}
          <span className="font-extrabold text-lg">
            {isEditMode ? "Edit Task Assignment" : "Assign New Task"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
      centered
      className="task-form-modal"
      maskStyle={{ backdropFilter: "blur(4px)" }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading task details...</p>
          </div>
        ) : (
          <TaskForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText={saving ? "Saving Changes..." : isEditMode ? "Save Changes" : "Assign Task"}
          />
        )}
      </div>
    </Modal>
  );
}
