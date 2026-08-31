"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProjectForm from "../projectcomponents/ProjectForm";
import { addProject } from "../data";

export default function AddProject() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

      await addProject(payload);

      alert("Project Added Successfully");

      router.push("/admin1/project-management");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add New Project</h1>
          <p className="mt-1 text-slate-500 font-medium">Create a new company project spec and project team assignment.</p>
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
        buttonText={loading ? "Saving..." : "Add Project"}
      />
    </div>
  );
}
