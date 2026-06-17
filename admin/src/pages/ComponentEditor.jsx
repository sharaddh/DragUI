import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import MarketplaceSettings from "../components/MarketplaceSettings";
import MonacoEditor from "../components/MonacoEditor";
import AssetManager from "../components/AssetManager";
import PreviewPanel from "../components/PreviewPanel";
import FileExplorer from "../components/FileExplorer";
import VersionModal from "../components/VersionModal";
import ComponentToolbar from "../components/ComponentToolbar";
import PropertyBuilder from "../components/PropertyBuilder";

// API
import { createVersion } from "../api/versionApi";
import { getComponent, createComponent, updateComponent } from "../api/componentApi";

const DEFAULT_CODE = `export default function Component() {\n  return (\n    <div>Hello World</div>\n  );\n}`;

export default function ComponentEditor() {
  const { id } = useParams();
  const [versionOpen, setVersionOpen] = useState(false);

  // 1. Unified State: Everything lives in one source of truth
  const [draft, setDraft] = useState({
    activeFile: "Component.jsx",
    files: [{ name: "Component.jsx", code: DEFAULT_CODE }],
    properties: [],
    assets: [],
    marketplace: { title: "", description: "", tags: [] },
  });

  // Derived state for the currently active file
  const currentFile = useMemo(
    () => draft.files.find((f) => f.name === draft.activeFile) || draft.files[0],
    [draft.files, draft.activeFile]
  );

  useEffect(() => {
    if (id) loadComponent();
  }, [id]);

  const loadComponent = async () => {
    try {
      const data = await getComponent(id);
      if (data) {
        setDraft((prev) => ({
          ...prev,
          activeFile: `${data.name}.jsx`,
          files: [{ name: `${data.name}.jsx`, code: data.code }],
          properties: data.props || [],
          assets: data.assets || [],
          marketplace: data.marketplace || prev.marketplace,
        }));
      }
    } catch (error) {
      toast.error("Failed to load component");
    }
  };

  // 2. Generic Update Handler: Replaces 5 different setter functions
  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateCode = (code) => {
    updateDraft(
      "files",
      draft.files.map((f) => (f.name === draft.activeFile ? { ...f, code } : f))
    );
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: draft.activeFile.replace(".jsx", ""),
        code: currentFile.code,
        props: draft.properties,
        assets: draft.assets,
        marketplace: draft.marketplace,
      };

      id ? await updateComponent(id, payload) : await createComponent(payload);
      toast.success("Component Saved!");
    } catch (error) {
      toast.error("Failed to save component");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] font-sans text-white overflow-hidden divide-y divide-white/[0.05]">
      
      {/* Toolbar */}
      <ComponentToolbar 
        onSave={handleSave} 
        onOpenVersion={() => setVersionOpen(true)} 
        componentName={draft.activeFile.replace(".jsx", "")}
      />

      {/* 3. Divide-X Layout: Automatically draws vertical borders between the 3 panes */}
      <div className="flex flex-1 overflow-hidden divide-x divide-white/[0.05]">
        
        {/* Left: Explorer */}
        <aside className="w-64 shrink-0 bg-[#0a0a0c] overflow-y-auto">
          <FileExplorer
            files={draft.files}
            selected={draft.activeFile}
            setSelected={(name) => updateDraft("activeFile", name)}
          />
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 bg-[#050505] relative flex flex-col">
          <MonacoEditor code={currentFile.code} setCode={updateCode} />
        </main>

        {/* Right: Preview & Settings */}
        {/* Divide-Y Layout: Automatically draws horizontal borders between Preview and Settings */}
        <aside className="w-[450px] shrink-0 bg-[#0a0a0c] flex flex-col divide-y divide-white/[0.05]">
          
          <div className="flex-1 relative flex flex-col bg-[#050505]">
            <div className="absolute top-0 left-0 w-full px-4 py-2 bg-[#0a0a0c]/80 backdrop-blur border-b border-white/[0.05] text-xs font-semibold text-white/50 uppercase z-10">
              Live Preview
            </div>
            <div className="flex-1 pt-8">
              <PreviewPanel code={currentFile.code} />
            </div>
          </div>

          {/* Divide-Y Layout: Draws lines between Builders, Assets, and Marketplace automatically */}
          <div className="h-[50%] overflow-y-auto p-6 flex flex-col gap-6 divide-y divide-white/[0.05]">
            <PropertyBuilder
              propsData={draft.properties}
              setPropsData={(data) => updateDraft("properties", data)}
            />
            
            <div className="pt-6">
              <AssetManager
                assets={draft.assets}
                setAssets={(data) => updateDraft("assets", data)}
              />
            </div>

            <div className="pt-6">
              <MarketplaceSettings
                marketplace={draft.marketplace}
                setMarketplace={(data) => updateDraft("marketplace", data)}
              />
            </div>
          </div>
        </aside>

      </div>

      <VersionModal
        open={versionOpen}
        onClose={() => setVersionOpen(false)}
        onSave={async (changelog) => {
          try {
            await createVersion(id, changelog);
            toast.success("Version Created");
            setVersionOpen(false);
          } catch {
            toast.error("Version Failed");
          }
        }}
      />
    </div>
  );
}