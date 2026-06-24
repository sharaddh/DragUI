import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../api/projects";
import { Plus, Trash2, ExternalLink, Search, Box, Loader2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(projectId);
      loadProjects();
    } catch {
      alert("Failed to delete");
    }
  };

  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-sm text-slate-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-slate-500">Manage your UI projects</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Box className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {search ? "No matching projects" : "No projects yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term"
              : "Create your first drag-and-drop project"}
          </p>
          {!search && (
            <Link
              to="/builder"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              key={project._id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Box className="h-5 w-5" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      navigate(`/builder?project=${project.projectId || project._id}`)
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-cyan-600"
                    title="Open project"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.projectId || project._id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{project.name}</h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">
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
          ))}
        </div>
      )}
    </div>
  );
}