import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Monitor, Tablet, Smartphone, Maximize2, MoveHorizontal } from "lucide-react";

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

const DEFAULT_CODE = `export default function Component() {\n  return (\n    <div className="p-6 text-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-colors">\n      <h2 className="text-xl font-bold text-black dark:text-white">Hello World</h2>\n      <p className="text-sm text-zinc-500 mt-1">Responsive Workspace Live</p>\n    </div>\n  );\n}`;

export default function ComponentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [versionOpen, setVersionOpen] = useState(false);

  // Layout resizing state
  const [leftWidth, setLeftWidth] = useState(256);
  const [rightWidth, setRightWidth] = useState(450);
  
  // Responsiveness state
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [frameWidth, setFrameWidth] = useState("100%");

  // Unified Workspace State
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

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateCode = (code) => {
    updateDraft(
      "files",
      draft.files.map((f) => (f.name === draft.activeFile ? { ...f, code } : f))
    );
  };

  // --- NEW: Rename Handler ---
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

  // --- UPGRADED: Save Handler with Redirect ---
  const handleSave = async () => {
    try {
      const payload = {
        name: draft.activeFile.replace(".jsx", ""),
        code: currentFile.code,
        props: draft.properties,
        assets: draft.assets,
        marketplace: draft.marketplace,
      };

      if (id) {
        await updateComponent(id, payload);
        toast.success("Component Updated!");
      } else {
        const response = await createComponent(payload);
        toast.success("Component Created!");
        // Stop duplicate slug errors by redirecting to the edit view
        const newId = response.component?._id || response._id;
        if (newId) navigate(`/components/${newId}`);
      }
    } catch (error) {
      toast.error("Failed to save. Name might already exist.");
      console.error(error);
    }
  };

  // --- Drag Resizers ---
  const handleLeftResize = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;
    const onMouseMove = (moveEvent) => {
      const currentWidth = startWidth + (moveEvent.clientX - startX);
      if (currentWidth > 180 && currentWidth < 400) setLeftWidth(currentWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleRightResize = (e) => {
    const startX = e.clientX;
    const startWidth = rightWidth;
    const onMouseMove = (moveEvent) => {
      const currentWidth = startWidth - (moveEvent.clientX - startX);
      if (currentWidth > 300 && currentWidth < 700) setRightWidth(currentWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleFrameResize = (e) => {
    e.preventDefault();
    setDeviceMode("custom");
    const containerWidth = e.currentTarget.parentElement.clientWidth;
    const startX = e.clientX;
    const startWidth = iframeRef.current ? iframeRef.current.clientWidth : containerWidth;

    const onMouseMove = (moveEvent) => {
      let calculatedWidth = startWidth + (moveEvent.clientX - startX) * 2; 
      calculatedWidth = Math.max(320, Math.min(calculatedWidth, containerWidth - 40));
      setFrameWidth(`${calculatedWidth}px`);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] font-sans text-white overflow-hidden divide-y divide-white/[0.05]">
      
      {/* Dynamic Toolbar */}
      <ComponentToolbar 
        onSave={handleSave} 
        onOpenVersion={() => setVersionOpen(true)} 
        componentName={draft.activeFile.replace(".jsx", "")}
        onNameChange={handleRename}
      />

      <div className="flex flex-1 overflow-hidden select-none">
        
        {/* Left Panel */}
        <aside style={{ width: `${leftWidth}px` }} className="shrink-0 bg-[#0a0a0c] overflow-y-auto">
          <FileExplorer
            files={draft.files}
            selected={draft.activeFile}
            setSelected={(name) => updateDraft("activeFile", name)}
          />
        </aside>

        <div 
          onMouseDown={handleLeftResize} 
          className="w-1 hover:w-1.5 bg-transparent hover:bg-purple-500/50 cursor-col-resize transition-all shrink-0 active:bg-purple-500 z-20" 
        />

        {/* Center Panel */}
        <main className="flex-1 bg-[#050505] relative flex flex-col min-w-0 z-10">
          <MonacoEditor code={currentFile.code} setCode={updateCode} />
        </main>

        <div 
          onMouseDown={handleRightResize} 
          className="w-1 hover:w-1.5 bg-transparent hover:bg-purple-500/50 cursor-col-resize transition-all shrink-0 active:bg-purple-500 z-20" 
        />

        {/* Right Panel */}
        <aside style={{ width: `${rightWidth}px` }} className="shrink-0 bg-[#0a0a0c] flex flex-col divide-y divide-white/[0.05] min-w-0">
          
          {/* Top Half: Responsive Preview */}
          <div className="flex-1 relative flex flex-col bg-[#111113]">
            <div className="w-full px-4 py-2 bg-[#0a0a0c] border-b border-white/[0.05] flex items-center justify-between z-10 shrink-0">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Responsive Viewport
              </span>
              
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
                {["desktop", "tablet", "mobile", "custom"].map((mode) => {
                  const Icon = mode === "desktop" ? Monitor : mode === "tablet" ? Tablet : mode === "mobile" ? Smartphone : Maximize2;
                  return (
                    <button 
                      key={mode}
                      onClick={() => setDeviceMode(mode)}
                      className={`p-1.5 rounded-md transition-all ${deviceMode === mode ? "bg-purple-600 text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwIDEACvw////P1RhKCaowfAAAF1yF182lX9XAAAAAElFTkSuQmCC')]">
              <div 
                ref={iframeRef}
                style={{ width: frameWidth }} 
                className="h-full relative transition-all duration-200 shadow-2xl bg-white rounded-xl overflow-hidden ring-1 ring-white/10"
              >
                <PreviewPanel code={currentFile.code} />
                
                {deviceMode === "custom" && (
                  <div 
                    onMouseDown={handleFrameResize}
                    className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-12 bg-purple-600 hover:bg-purple-500 rounded-l-md border-l border-y border-purple-400/30 flex items-center justify-center cursor-ew-resize active:scale-95 transition-all z-50 shadow-lg"
                  >
                    <MoveHorizontal className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[#0a0a0c]/90 text-[10px] text-center font-mono py-1.5 border-t border-white/[0.05] text-white/40 tracking-wide shrink-0">
              {frameWidth === "100%" ? "Fluid Width (100%)" : `Constrained Width: ${frameWidth}`}
            </div>
          </div>

          {/* Bottom Half: Settings */}
          <div className="h-[45%] overflow-y-auto p-6 flex flex-col gap-6 divide-y divide-white/[0.05] bg-[#0a0a0c]">
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