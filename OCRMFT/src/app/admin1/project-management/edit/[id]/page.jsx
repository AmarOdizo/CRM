"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        technologyStack: formData.technologyStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading Project...
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
          <h1 className="text-3xl font-bold text-slate-800">Edit Project</h1>

          <p className="mt-2 text-slate-500">Update project information.</p>
        </div>

        <Link
          href="/admin1/project-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      <ProjectForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={saving ? "Updating..." : "Update Project"}
      />
    </div>
  );
}
