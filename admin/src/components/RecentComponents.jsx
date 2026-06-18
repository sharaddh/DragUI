import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Box, Clock, Loader2 } from "lucide-react";
import { getComponents } from "../api/componentApi";

// Quick helper to make timestamps look like "5m ago" or "2d ago"
const timeAgo = (dateString) => {
  if (!dateString) return "Just now";
  const diff = new Date() - new Date(dateString);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function RecentComponents({ items }) {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState(items || []);
  const [isLoading, setIsLoading] = useState(!items);

  // Fetch recent components if they aren't passed down as props
  useEffect(() => {
    if (items) {
      setRecentItems(items);
      return;
    }

    const fetchRecent = async () => {
      try {
        const data = await getComponents();
        // Grab only the 5 most recent components
        const sorted = (data.components || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setRecentItems(sorted);
      } catch (error) {
        console.error("Failed to fetch recent components:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, [items]);

  return (
    <div className="relative h-full bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-[2px]" />

      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-1">
            Recent Additions
          </h2>
          <p className="text-sm text-white/40 font-light">Your latest UI building blocks</p>
        </div>
        <button 
          onClick={() => navigate('/components')}
          className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 rounded-full border border-white/[0.05]"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500/50 animate-spin mb-3" />
            <p className="text-white/40 text-sm font-medium">Loading recent data...</p>
          </div>
        ) : recentItems.length > 0 ? (
          // Component List
          recentItems.map((component) => (
            <div
              key={component._id}
              onClick={() => navigate(`/components/edit/${component._id}`)}
              className="group relative flex justify-between items-center p-4 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.1] transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center gap-4">
                {/* Elegant Icon Box (Shows Thumbnail if exists, otherwise Box icon) */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-500 overflow-hidden shrink-0">
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-2xl blur-[2px] opacity-30 z-10" />
                  {component.thumbnail ? (
                    <img src={component.thumbnail} alt={component.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                  ) : (
                    <Box className="w-5 h-5 text-white/60 group-hover:text-purple-300 transition-colors relative z-20" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                    {component.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mt-1 font-light">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(component.createdAt || component.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                {/* Version Pill */}
                <div className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 shadow-[inset_0_1px_5px_rgba(255,255,255,0.05)] hidden sm:flex">
                  <span className="text-xs font-mono font-medium text-blue-300/80 group-hover:text-blue-300 transition-colors">
                    v{component.version || "1.0.0"}
                  </span>
                </div>

                {/* Reveal-on-hover Action Menu */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card click from firing
                    // You could add a dropdown menu here later!
                  }}
                  className="p-2 rounded-xl text-white/30 hover:text-white/90 hover:bg-white/10 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 duration-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-white/[0.01] border border-white/[0.02] border-dashed">
            <Box className="w-10 h-10 text-white/20 mb-3" />
            <p className="text-white/40 text-sm font-medium">No components pushed yet.</p>
            <p className="text-white/20 text-xs mt-1">They will appear here once created.</p>
          </div>
        )}
      </div>
    </div>
  );
}