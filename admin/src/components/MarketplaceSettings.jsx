import { Store } from "lucide-react";

export default function MarketplaceSettings({ marketplace, setMarketplace }) {
  return (
    <div className="space-y-4 font-sans">
      <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
        <Store className="w-4 h-4 text-emerald-400" />
        Marketplace Meta
      </h2>
      
      <div className="space-y-3">
        <input
          value={marketplace.title}
          placeholder="Marketplace Display Title"
          onChange={(e) => setMarketplace({ ...marketplace, title: e.target.value })}
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />

        <textarea
          value={marketplace.description}
          placeholder="Describe what this component does..."
          rows={4}
          onChange={(e) => setMarketplace({ ...marketplace, description: e.target.value })}
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
        />
      </div>
    </div>
  );
}