import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Monitor, Tablet, Smartphone, Maximize2, MoveHorizontal } from "lucide-react";

import MarketplaceSettings from "../components/MarketplaceSettings";
import MonacoEditor from "../components/MonacoEditor";
import AssetManager from "../components/AssetManager";
import PreviewPanel from "../components/PreviewPanel";
import FileExplorer from "../components/FileExplorer";
import VersionModal from "../components/VersionModal";
import ComponentToolbar from "../components/ComponentToolbar";
import PropertyBuilder from "../components/PropertyBuilder";

import { createVersion } from "../api/versionApi";
import { getComponent, createComponent, updateComponent } from "../api/componentApi";

const DEFAULT_CODE = `export default function Component() {\n  return (\n    <div className="p-6 text-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">\n      <h2 className="text-xl font-bold dark:text-white">Hello World</h2>\n    </div>\n  );\n}`;

export default function ComponentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(!!id);
  const [versionOpen, setVersionOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(256);
  const [rightWidth, setRightWidth] = useState(450);
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [frameWidth, setFrameWidth] = useState("100%");

  const [draft, setDraft] = useState({
    activeFile: "Component.jsx",
    files: [{ name: "Component.jsx", code: DEFAULT_CODE }],
    properties: [],
    assets: [],
    marketplace: { title: "", description: "", tags: [] },
  });

  const iframeRef = useRef(null);

  const currentFile = useMemo(
    () => draft.files.find((f) => f.name === draft.activeFile) || draft.files[0],
    [draft.files, draft.activeFile]
  );

  useEffect(() => {
    if (id) loadComponent();
  }, [id]);

  useEffect(() => {
    if (deviceMode === "desktop") setFrameWidth("100%");
    else if (deviceMode === "tablet") setFrameWidth("768px");
    else if (deviceMode === "mobile") setFrameWidth("375px");
  }, [deviceMode]);

  const loadComponent = async () => {
    try {
      const response = await getComponent(id);
      const data = response?.component || response?.data?.component || response;

      if (data && data.name) {
        setDraft((prev) => ({
          ...prev,
          activeFile: `${data.name}.jsx`,
          files: [{ name: `${data.name}.jsx`, code: data.code || DEFAULT_CODE }],
          properties: data.props || [],
          assets: data.assets || [],
          marketplace: data.marketplace || prev.marketplace,
        }));
      }
    } catch (error) {
      toast.error("Failed to load component");
      console.error(error);
    } finally {
      // 🌟 NEW: Turn off the loading screen
      setIsFetching(false);
    }
  };

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateCode = (code) => {
    updateDraft(
      "files",
      draft.files.map((f) => (f.name === draft.activeFile ? { ...f, code } : f))
    );
  };

  // 🟢 RENAMING LOGIC
  const handleRename = (newName) => {
    const safeName = newName || "Untitled";
    const newFileName = `${safeName}.jsx`;

    setDraft((prev) => ({
      ...prev,
      activeFile: newFileName,
      files: prev.files.map((f) =>
        f.name === prev.activeFile ? { ...f, name: newFileName } : f
      )
    }));
  };

  // 🟢 SAVING LOGIC
  const handleSave = async () => {
    try {
      console.log("🛑 1. SAVE BUTTON CLICKED");
      
      if (!currentFile) {
        alert("CRASH: currentFile is missing!");
        return;
      }

      console.log("🛑 2. BUILDING PAYLOAD...");
      const payload = {
        name: draft.activeFile.replace(".jsx", ""),
        code: currentFile.code,
        props: draft.properties || [],
        assets: draft.assets || [],
        marketplace: draft.marketplace || {},
      };
      
      console.log("🛑 3. PAYLOAD BUILT: ", payload);

      if (id) {
        console.log("🛑 4. SENDING PUT REQUEST TO BACKEND FOR ID:", id);
        // If it crashes here, your updateComponent API function is broken!
        await updateComponent(id, payload);
        toast.success("Component Updated!");
        console.log("✅ 5. SAVE SUCCESSFUL!");
      } else {
        const response = await createComponent(payload);
        toast.success("Component Created!");
        const newId = response.component?._id || response._id;
        if (newId) navigate(`/components/${newId}`);
      }
    } catch (error) {
      console.error("🔥 FRONTEND SAVE CRASH:", error);
      alert(`Save Failed: ${error.message || "Check console"}`);
    }
  };
  if (isFetching) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="w-8 h-8 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase">Loading Workspace...</p>
      </div>
    );
  }
  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] font-sans text-white overflow-hidden divide-y divide-white/[0.05]">
    {/* ... Rest of your UI ... */}

      {/* 🟢 PASS THE RENAME HANDLER HERE */}
      <ComponentToolbar
        onSave={handleSave}
        onOpenVersion={() => setVersionOpen(true)}
        componentName={draft.activeFile.replace(".jsx", "")}
        onNameChange={handleRename}
      />

      <div className="flex flex-1 overflow-hidden select-none">

        <aside style={{ width: `${leftWidth}px` }} className="shrink-0 bg-[#0a0a0c] overflow-y-auto">
          <FileExplorer
            files={draft.files}
            selected={draft.activeFile}
            setSelected={(name) => updateDraft("activeFile", name)}
          />
        </aside>

        <main className="flex-1 bg-[#050505] relative flex flex-col min-w-0 z-10">
          <MonacoEditor code={currentFile.code} setCode={updateCode} />
        </main>

        <aside style={{ width: `${rightWidth}px` }} className="shrink-0 bg-[#0a0a0c] flex flex-col divide-y divide-white/[0.05] min-w-0">

          <div className="flex-1 relative flex flex-col bg-[#111113]">
            <div className="w-full px-4 py-2 bg-[#0a0a0c] border-b border-white/[0.05] flex items-center justify-between z-10 shrink-0">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Responsive Viewport</span>
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
                {["desktop", "tablet", "mobile"].map((mode) => {
                  const Icon = mode === "desktop" ? Monitor : mode === "tablet" ? Tablet : Smartphone;
                  return (
                    <button
                      key={mode}
                      onClick={() => setDeviceMode(mode)}
                      className={`p-1.5 rounded-md transition-all ${deviceMode === mode ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwIDEACvw////P1RhKCaowfAAAF1yF182lX9XAAAAAElFTkSuQmCC')]">
              <div ref={iframeRef} style={{ width: frameWidth }} className="h-full relative transition-all duration-200 shadow-2xl bg-white rounded-xl overflow-hidden ring-1 ring-white/10">
                {/* 🟢 PASS ASSETS TO PREVIEW SO IT CAN RENDER IMAGES */}
                <PreviewPanel code={currentFile.code} assets={draft.assets} />
              </div>
            </div>
          </div>

          <div className="h-[45%] overflow-y-auto p-6 flex flex-col gap-6 divide-y divide-white/[0.05] bg-[#0a0a0c]">
            <PropertyBuilder propsData={draft.properties} setPropsData={(data) => updateDraft("properties", data)} />

            {/* 🟢 PASS ASSETS TO MANAGER */}
            <div className="pt-6">
              <AssetManager assets={draft.assets} setAssets={(data) => updateDraft("assets", data)} />
            </div>

            <div className="pt-6">
              <MarketplaceSettings marketplace={draft.marketplace} setMarketplace={(data) => updateDraft("marketplace", data)} />
            </div>
          </div>
        </aside>

      </div>

      <VersionModal open={versionOpen} onClose={() => setVersionOpen(false)} onSave={() => { }} />
    </div>
  );
}