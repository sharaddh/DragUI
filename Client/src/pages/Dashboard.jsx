import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projects";
import { LayoutDashboard, Box, Puzzle, Palette, ArrowRight, Plus } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      const list = res.data.projects || [];
      setProjects(list.slice(0, 4));
      setStats({
        total: list.length,
        published: list.filter((p) => p.isPublished).length,
        drafts: list.filter((p) => !p.isPublished).length,
      });
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { to: "/builder", label: "Open Builder", icon: Puzzle, desc: "Drag & drop UI builder" },
    { to: "/projects", label: "My Projects", icon: Box, desc: "View all your projects" },
    { to: "/theme", label: "Theme Editor", icon: Palette, desc: "Customize global theme" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome back! Manage your projects and settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Projects</p>
            <Box className="h-5 w-5 text-cyan-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Published</p>
            <LayoutDashboard className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.published}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Drafts</p>
            <Puzzle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.drafts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100">
              <link.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900">{link.label}</h3>
            <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-600">
              Get started <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
          >
            View all
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="mt-6 text-center">
            <Box className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No projects yet</p>
            <Link
              to="/builder"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {projects.map((project) => (
              <div key={project._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">{project.name}</p>
                  <p className="text-sm text-slate-500">
                    {project.type || "frontend"} &middot; {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                  <Link
                    to={`/builder?project=${project.projectId || project._id}`}
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}