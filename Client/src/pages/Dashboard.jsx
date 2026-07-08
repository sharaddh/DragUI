import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { getProjects } from "../api/projects";
import {
  LayoutDashboard, Box, Puzzle, Palette, ArrowRight, Plus,
  TrendingUp, FileText, Sparkles, Clock, User,
} from "lucide-react";
import { CardSkeleton, TableRowSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
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

  const isNewUser = !loading && stats.total === 0;
  const statCards = [
    { label: "Total Projects", value: stats.total, icon: Box, color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "Published", value: stats.published, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Drafts", value: stats.drafts, icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  ];
  const quickLinks = [
    { to: "/builder", label: "Open Builder", icon: Puzzle, desc: "Drag & drop UI builder" },
    { to: "/projects", label: "My Projects", icon: Box, desc: "View all your projects" },
    { to: "/theme", label: "Theme Editor", icon: Palette, desc: "Customize global theme" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isNewUser ? "Welcome to DropUI!" : "Dashboard"}
          </h1>
          <p className="mt-1 text-slate-500">
            {isNewUser
              ? "Start building your first project with drag & drop"
              : `Welcome back${user?.username ? `, ${user.username}` : ""}! Manage your projects and settings.`
            }
          </p>
        </div>
        {!loading && !isNewUser && (
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        )}
      </div>

      {/* New user welcome banner */}
      {isNewUser && (
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Get Started in 3 Steps</h2>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">1</span>
                  Create a new project from the Projects page
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">2</span>
                  Drag and drop components onto the canvas in the Builder
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">3</span>
                  Export your code or publish your project
                </li>
              </ol>
              <Link
                to="/builder"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          statCards.map((card) => (
            <div
              key={card.label}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <div className={`rounded-xl ${card.bg} p-2.5 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${stats.total ? (card.value / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100 group-hover:scale-110">
              <link.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900">{link.label}</h3>
            <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-600 transition group-hover:gap-2">
              Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          </div>
          <Link to="/projects" className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 divide-y divide-slate-100">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Box}
              title="No projects yet"
              description="Create your first drag-and-drop project to get started"
              actionLabel="Create Project"
              actionTo="/builder"
            />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {projects.map((project) => (
              <div key={project._id} className="flex items-center justify-between py-3.5 transition hover:bg-slate-50/50 -mx-2 px-2 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                    <Box className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{project.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {project.type || "frontend"} &middot; {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
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
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition"
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
