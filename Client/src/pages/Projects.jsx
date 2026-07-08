import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../api/projects";
import {
  Plus, Trash2, ExternalLink, Search, Box, Loader2,
  ArrowUpDown, Grid3X3, List,
} from "lucide-react";
import CreateProjectModal from "../components/CreateProjectModal";
import { ProjectCardSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name A-Z" },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(projectId);
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => (p.projectId || p._id) !== projectId));
    } catch {
      //
    } finally {
      setDeleting(null);
    }
  };

  let filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
    if (sort === "newest") return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    if (sort === "oldest") return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-slate-500">Manage your UI projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 hover:shadow-md self-start"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
            <button
              onClick={() => setView("grid")}
              className={`rounded-lg p-1.5 transition ${view === "grid" ? "bg-cyan-50 text-cyan-600" : "text-slate-400 hover:text-slate-600"}`}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg p-1.5 transition ${view === "list" ? "bg-cyan-50 text-cyan-600" : "text-slate-400 hover:text-slate-600"}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 w-48 rounded bg-slate-200" />
                    <div className="mt-1 h-3 w-32 rounded bg-slate-200" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Box}
          title={search ? "No matching projects" : "No projects yet"}
          description={search ? "Try a different search term" : "Create your first drag-and-drop project"}
          actionLabel={search ? undefined : "Create Project"}
          onAction={search ? undefined : () => setShowModal(true)}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const id = project.projectId || project._id;
            return (
              <div
                key={project._id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 transition group-hover:scale-110">
                    <Box className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/builder?project=${id}`)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-cyan-600"
                      title="Open project"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deleting === id}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Delete project"
                    >
                      <Trash2 className={`h-4 w-4 ${deleting === id ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 truncate">{project.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
                  {project.description || "No description"}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="capitalize">{project.type || "frontend"}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 font-medium ${
                      project.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="divide-y divide-slate-100">
            {filtered.map((project) => {
              const id = project.projectId || project._id;
              return (
                <div key={project._id} className="flex items-center justify-between py-3.5 transition hover:bg-slate-50/50 -mx-2 px-2 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <Box className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{project.name}</p>
                      <p className="truncate text-sm text-slate-500">
                        {project.description || "No description"} &middot; {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 ml-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                    <button onClick={() => navigate(`/builder?project=${id}`)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-cyan-600" title="Open">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(id)}
                      disabled={deleting === id}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50" title="Delete">
                      <Trash2 className={`h-4 w-4 ${deleting === id ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <CreateProjectModal open={showModal} onClose={() => { setShowModal(false); loadProjects(); }} />
    </div>
  );
}
