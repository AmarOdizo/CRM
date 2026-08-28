"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProjectForm from "../../projectcomponents/ProjectForm";
import { getProjectById, updateProject } from "../../data";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    clientName: "",
    projectManager: "",
    teamMembers: "",
    startDate: "",
    endDate: "",
    budget: "",
    priority: "Medium",
    status: "Planning",
    technologyStack: "",
    description: "",
  });

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(id);

      setFormData({
        projectName: data.projectName || "",
        projectCode: data.projectCode || "",
        clientName: data.clientName || "",
        projectManager: data.projectManager || "",
        teamMembers: Array.isArray(data.teamMembers)
          ? data.teamMembers.join(", ")
          : "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        budget: data.budget || "",
        priority: data.priority || "Medium",
        status: data.status || "Planning",
        technologyStack: Array.isArray(data.technologyStack)
          ? data.technologyStack.join(", ")
          : "",
        description: data.description || "",
      });
    } catch (error) {
      console.log(error);
      alert("Project Not Found");
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

      const payload = {
        ...formData,
        teamMembers: formData.teamMembers
          ? formData.teamMembers
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        technologyStack: formData.technologyStack
          ? formData.technologyStack
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };

      await updateProject(id, payload);

      alert("Project Updated Successfully");

      router.push("/admin1/project-management");
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
          <h2 className="text-lg font-bold text-slate-700">Loading Project...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve project specs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Project</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">Update company project specifications and deadlines.</p>
        </div>

        <Link
          href="/admin1/project-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      <ProjectForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={saving ? "Updating..." : "Update Project"}
      />
    </div>
  );
}
