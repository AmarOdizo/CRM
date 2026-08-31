"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Upload,
  Search,
  Filter,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Download,
  Trash2,
  Plus,
  X,
  Sparkles,
  FolderKanban,
  CheckCircle2,
  HardDrive,
  Eye,
} from "lucide-react";

export default function UploadFilesPage() {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [fileCategory, setFileCategory] = useState("Document");
  const [fileDescription, setFileDescription] = useState("");
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Fetch projects from backend API to populate dropdown
      const projectRes = await axios.get("http://localhost:5000/api/Project").catch(() => null);
      const projectList = Array.isArray(projectRes?.data?.data) ? projectRes.data.data : [];
      setProjects(projectList);

      // Pre-populated default files repository data combined with localStorage
      const defaultFiles = [
        {
          id: "f-101",
          fileName: "Project_Requirements_v2.pdf",
          projectName: projectList[0]?.projectName || "Odizo CRM Upgrade",
          category: "Specification",
          size: "2.4 MB",
          uploadedBy: "Kamal Kumar",
          uploadDate: "2026-08-25",
          fileType: "pdf",
        },
        {
          id: "f-102",
          fileName: "Database_Architecture_Diagram.png",
          projectName: projectList[1]?.projectName || "E-Commerce Gateway",
          category: "Design Architecture",
          size: "4.1 MB",
          uploadedBy: "Kamal Kumar",
          uploadDate: "2026-08-28",
          fileType: "image",
        },
        {
          id: "f-103",
          fileName: "Sprint_Performance_Report.xlsx",
          projectName: projectList[0]?.projectName || "Odizo CRM Upgrade",
          category: "Report",
          size: "1.2 MB",
          uploadedBy: "Admin",
          uploadDate: "2026-08-30",
          fileType: "spreadsheet",
        },
      ];

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_uploaded_files");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setFiles([...parsed, ...defaultFiles]);
          } catch (e) {
            setFiles(defaultFiles);
          }
        } else {
          setFiles(defaultFiles);
        }
      } else {
        setFiles(defaultFiles);
      }
    } catch (err) {
      console.error("Error loading files data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newFileName || !selectedProject) return;

    setUploading(true);

    const newDoc = {
      id: `f-${Date.now()}`,
      fileName: newFileName,
      projectName: selectedProject,
      category: fileCategory,
      size: selectedFileObj ? `${(selectedFileObj.size / (1024 * 1024)).toFixed(2)} MB` : "1.8 MB",
      uploadedBy: "Logged Employee",
      uploadDate: new Date().toISOString().split("T")[0],
      fileType: newFileName.endsWith(".pdf") ? "pdf" : newFileName.endsWith(".xlsx") ? "spreadsheet" : "document",
    };

    const updatedFiles = [newDoc, ...files];
    setFiles(updatedFiles);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_uploaded_files", JSON.stringify([newDoc]));
    }

    setUploading(false);
    setModalOpen(false);
    setSuccessMsg(`File "${newFileName}" uploaded successfully!`);
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset Form
    setNewFileName("");
    setSelectedProject("");
    setFileDescription("");
    setSelectedFileObj(null);
  };

  const handleDeleteFile = (id) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
  };

  const filteredFiles = files.filter((f) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (f.fileName || "").toLowerCase().includes(searchLower) ||
      (f.category || "").toLowerCase().includes(searchLower) ||
      (f.projectName || "").toLowerCase().includes(searchLower);

    const matchesProject =
      projectFilter === "ALL" ||
      (f.projectName || "").toLowerCase() === projectFilter.toLowerCase();

    return matchesSearch && matchesProject;
  });

  const getFileIcon = (fileType) => {
    if (fileType === "pdf") return <FileText className="text-rose-500" size={20} />;
    if (fileType === "spreadsheet") return <FileSpreadsheet className="text-emerald-500" size={20} />;
    if (fileType === "image") return <FileCode className="text-indigo-500" size={20} />;
    return <FileArchive className="text-cyan-500" size={20} />;
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-3">
              <Upload size={13} />
              <span>PROJECT FILE VAULT</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Upload Project Files
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Attach technical specs, design assets, and progress reports to assigned client projects.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Documents
            </span>
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 border border-cyan-100">
              <FileText size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{files.length}</h3>
          <p className="text-[11px] font-semibold text-cyan-600 mt-1">Uploaded & Shared</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Storage Used
            </span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 border border-indigo-100">
              <HardDrive size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">24.5 MB</h3>
          <p className="text-[11px] font-semibold text-indigo-600 mt-1">Cloud Sync Active</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Linked Projects
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
              <FolderKanban size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{projects.length || 3}</h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Active Deliverables</p>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by file name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Project Filter:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p._id || p.id} value={p.projectName}>
                {p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FILES TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600 mx-auto" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading document vault...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Upload size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No Documents Found</p>
            <p className="text-xs text-slate-400 mt-1">Upload your first document for an assigned project.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">File Name</th>
                  <th className="py-4 px-5">Associated Project</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Size</th>
                  <th className="py-4 px-5">Upload Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                          {getFileIcon(f.fileType)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{f.fileName}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            Uploaded by {f.uploadedBy}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-700">
                      {f.projectName}
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-100">
                        {f.category}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-mono text-slate-500">{f.size}</td>

                    <td className="py-4 px-5 font-medium text-slate-600">{f.uploadDate}</td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Downloading ${f.fileName}...`)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 transition cursor-pointer border border-slate-200"
                          title="Download File"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(f.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer border border-slate-200"
                          title="Delete File"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full w-fit mb-3">
              <Upload size={13} />
              <span>UPLOAD ATTACHMENT</span>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Attach File to Project
            </h2>

            <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Document Title / File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System_Design_Spec.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Target Project
                </label>
                <select
                  required
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition cursor-pointer"
                >
                  <option value="">Select an assigned project...</option>
                  {projects.length > 0 ? (
                    projects.map((p) => (
                      <option key={p._id || p.id} value={p.projectName}>
                        {p.projectName} ({p.projectCode || "PRJ"})
                      </option>
                    ))
                  ) : (
                    <option value="Odizo Enterprise Upgrade">Odizo Enterprise Upgrade</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  File Category
                </label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition cursor-pointer"
                >
                  <option value="Specification">Specification</option>
                  <option value="Design Architecture">Design Architecture</option>
                  <option value="Report">Report</option>
                  <option value="Contract / Invoice">Contract / Invoice</option>
                  <option value="Source Code Backup">Source Code Backup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Choose Local File
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFileObj(file);
                      if (!newFileName) setNewFileName(file.name);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Confirm & Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
