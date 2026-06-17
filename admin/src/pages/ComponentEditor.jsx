import { useState, useEffect } from "react";
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

export default function ComponentEditor() {
  const { id } = useParams();

  // State
  const [versionOpen, setVersionOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [propsData, setPropsData] = useState([]);
  const [marketplace, setMarketplace] = useState({ title: "", description: "", tags: [] });
  const [selected, setSelected] = useState("Button.jsx");
  const [files, setFiles] = useState([
    {
      name: "Button.jsx",
      code: `export default function Button() {\n  return (\n    <button>\n      Click\n    </button>\n  );\n}`,
    },
  ]);

  const current = files.find((file) => file.name === selected) || files[0];

  useEffect(() => {
    if (id) {
      loadComponent();
    }
  }, [id]);

  const loadComponent = async () => {
    try {
      const data = await getComponent(id);
      if (data) {
        setFiles([{ name: `${data.name}.jsx`, code: data.code }]);
        setSelected(`${data.name}.jsx`);
        // Note: You may also want to set propsData, assets, etc. from `data` here
      }
    } catch (error) {
      toast.error("Failed to load component");
    }
  };

  const saveVersion = async (changelog) => {
    try {
      await createVersion(id, changelog);
      toast.success("Version Created successfully");
      setVersionOpen(false);
    } catch (error) {
      toast.error("Version Creation Failed");
    }
  };

  const updateCode = (code) => {
    setFiles((prev) =>
      prev.map((file) => (file.name === selected ? { ...file, code } : file))
    );
  };

  const saveComponent = async () => {
    try {
      const payload = {
        name: selected.replace(".jsx", ""),
        code: current.code,
        props: propsData,
        assets: assets,
        marketplace: marketplace,
      };

      if (id) {
        await updateComponent(id, payload);
      } else {
        await createComponent(payload);
      }

      toast.success("Component Saved!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save component");
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col bg-[#050505] font-sans overflow-hidden text-white">
      
      {/* --- Toolbar Area --- */}
      {/* Fixed: Wrapped ComponentToolbar in JSX brackets and passed actions */}
      <div className="shrink-0 border-b border-white/[0.05] bg-[#0a0a0c]">
        <ComponentToolbar 
          onSave={saveComponent} 
          onOpenVersion={() => setVersionOpen(true)} 
          componentName={selected.replace(".jsx", "")}
        />
      </div>

      {/* --- Main IDE Workspace --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: File Explorer */}
        <aside className="w-64 shrink-0 border-r border-white/[0.05] bg-[#0a0a0c] overflow-y-auto">
          <FileExplorer
            files={files}
            selected={selected}
            setSelected={setSelected}
          />
        </aside>

        {/* Center Panel: Code Editor */}
        <main className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
          <MonacoEditor
            code={current.code}
            setCode={updateCode}
          />
        </main>

        {/* Right Panel: Preview & Settings */}
        <aside className="w-[450px] shrink-0 border-l border-white/[0.05] bg-[#0a0a0c] flex flex-col">
          
          {/* Top Half: Live Preview */}
          <div className="flex-1 border-b border-white/[0.05] bg-[#050505] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full px-4 py-2 bg-[#0a0a0c] border-b border-white/[0.05] text-xs font-semibold text-white/50 uppercase tracking-wider z-10">
              Live Preview
            </div>
            <div className="flex-1 pt-8">
              <PreviewPanel code={current.code} />
            </div>
          </div>

          {/* Bottom Half: Component Builders & Settings */}
          <div className="h-[50%] overflow-y-auto p-6 space-y-8">
            <PropertyBuilder
              propsData={propsData}
              setPropsData={setPropsData}
            />
            
            <div className="h-px w-full bg-white/[0.05]" />
            
            <AssetManager
              assets={assets}
              setAssets={setAssets}
            />

            <div className="h-px w-full bg-white/[0.05]" />
            
            <MarketplaceSettings
              marketplace={marketplace}
              setMarketplace={setMarketplace}
            />
          </div>

        </aside>
      </div>

      {/* --- Modals --- */}
      {/* Fixed: Moved out of the scrollable right pane to the root level */}
      <VersionModal
        open={versionOpen}
        onClose={() => setVersionOpen(false)}
        onSave={saveVersion}
      />
      
    </div>
  );
}