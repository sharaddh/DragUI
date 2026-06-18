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
    <div className="p-6 md:p-10 space-y-8 font-sans bg-[#050505] min-h-screen">
      
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

      {/* --- Components Grid --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-white/40 text-sm font-medium tracking-wide">Loading registry...</p>
        </div>
      ) : (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((component) => (
                <ComponentCard
                  key={component._id}
                  component={component}
                  onDelete={remove}
                  onPublish={publish}
                  onArchive={archive}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 rounded-3xl bg-white/[0.01] border border-white/[0.03] border-dashed">
              <PackageOpen className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-white/60 font-medium text-lg">No components found.</p>
              <p className="text-white/30 text-sm mt-1">Try adjusting your search or create a new one.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}