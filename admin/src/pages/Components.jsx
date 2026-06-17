import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, PackageOpen } from "lucide-react";
import ComponentCard from "../components/ComponentCard";
import {
  getComponents,
  publishComponent,
  archiveComponent,
  deleteComponent
} from "../api/componentApi";

export default function Components() {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await getComponents();
      setComponents(data.components || []);
    } catch (error) {
      console.error("Failed to load components:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const publish = async (id) => {
    await publishComponent(id);
    load();
  };

  const archive = async (id) => {
    await archiveComponent(id);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this component?")) {
      return;
    }
    await deleteComponent(id);
    load();
  };

  const filtered = components.filter((component) =>
    component.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Component Registry
          </h1>
          <p className="text-sm text-white/40">
            Manage, publish, and track your UI building blocks.
          </p>
        </div>

        <Link
          to="/components/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Component
        </Link>
      </div>

      {/* --- Search & Filters --- */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search components by name..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.04] focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 transition-all duration-300"
        />
      </div>

      {/* --- Components List --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-white/40 text-sm">Loading registry...</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.length > 0 ? (
            filtered.map((component) => (
              <div
                key={component._id}
                className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-[#0a0a0c] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300 gap-4"
              >
                
                {/* Component Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors">
                    <PackageOpen className="w-6 h-6 text-white/50 group-hover:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white/90 group-hover:text-white mb-0.5">
                      {component.name}
                    </h3>
                    <p className="text-xs text-white/40 font-mono">
                      {component.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    component.status === 'Published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : component.status === 'Archived'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20' // Draft/Other
                  }`}>
                    {component.status || "Draft"}
                  </span>
                </div>

                {/* Actions Wrapper (Assuming ComponentCard renders action buttons/menus) */}
                <div className="sm:ml-4 border-t sm:border-t-0 sm:border-l border-white/[0.05] pt-4 sm:pt-0 sm:pl-4 w-full sm:w-auto flex justify-end">
                  <ComponentCard
                    component={component}
                    onDelete={remove}
                    onPublish={publish}
                    onArchive={archive}
                  />
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] border-dashed">
              <PackageOpen className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/60 font-medium">No components found.</p>
              <p className="text-white/30 text-sm mt-1">Try adjusting your search or create a new one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}