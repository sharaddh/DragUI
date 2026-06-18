import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Monitor, Tablet, Smartphone, Maximize2, MoveHorizontal } from "lucide-react";

// Components
import MarketplaceSettings from "../components/MarketplaceSettings";
import MonacoEditor from "../components/MonacoEditor";
import AssetManager from "../components/AssetManager";
import PreviewPanel from "../components/PreviewPanel"; // Pass size settings here
import FileExplorer from "../components/FileExplorer";
import VersionModal from "../components/VersionModal";
import ComponentToolbar from "../components/ComponentToolbar";
import PropertyBuilder from "../components/PropertyBuilder";

// API
import { createVersion } from "../api/versionApi";
import { getComponent, createComponent, updateComponent } from "../api/componentApi";

const DEFAULT_CODE = `export default function Component() {\n  return (\n    <div className="p-6 text-center bg-purple-600/10 border border-purple-500/30 rounded-2xl">\n      <h2 className="text-xl font-bold">Hello World</h2>\n      <p className="text-sm text-white/60 mt-1">Responsive Workspace Live</p>\n    </div>\n  );\n}`;

export default function ComponentEditor() {
  const { id } = useParams();
  const [versionOpen, setVersionOpen] = useState(false);
  const navigate = useNavigate(); // <-- Add this hook
  // Layout resizing state
  const [leftWidth, setLeftWidth] = useState(256); // Default: 64rem / 256px
  const [rightWidth, setRightWidth] = useState(450); // Default: 450px

  // Responsiveness state
  const [deviceMode, setDeviceMode] = useState("desktop"); // desktop, tablet, mobile, custom
  const [frameWidth, setFrameWidth] = useState("100%");

  const [draft, setDraft] = useState({
    activeFile: "Component.jsx",
    files: [{ name: "Component.jsx", code: DEFAULT_CODE }],
    properties: [],
    assets: [],
    marketplace: { title: "", description: "", tags: [] },
  });

  const currentFile = useMemo(
    () => draft.files.find((f) => f.name === draft.activeFile) || draft.files[0],
    [draft.files, draft.activeFile]
  );

  useEffect(() => {
    if (id) loadComponent();
  }, [id]);

  // Adjust pre-configured screen size mappings
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

  // Make sure to import useNavigate at the top!

  // ... (rest of your state)

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
        // If we are already editing an existing component, just update it
        await updateComponent(id, payload);
        toast.success("Component Updated!");
      } else {
        // If this is a brand new component, create it...
        const response = await createComponent(payload);
        toast.success("Component Created!");

        // ...AND redirect the URL to the edit page so we don't cause a duplicate error!
        // (Make sure this matches your actual route, e.g., `/components/${response.component._id}`)
        const newId = response.component._id || response._id;
        navigate(`/components/${newId}`);
      }

    } catch (error) {
      toast.error("Failed to save component. Name might already be taken!");
    }
  };



  // Drag handlers to resize workspace windows
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
      if (currentWidth > 300 && currentWidth < 600) setRightWidth(currentWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Directly scaling the live preview iframe manually via drag handle
  const handleFrameResize = (e) => {
    e.preventDefault();
    setDeviceMode("custom");
    const containerWidth = e.currentTarget.parentElement.clientWidth;
    const startX = e.clientX;
    const startWidth = iframeRef.current ? iframeRef.current.clientWidth : containerWidth;

    const onMouseMove = (moveEvent) => {
      let calculatedWidth = startWidth + (moveEvent.clientX - startX) * 2; // Symmetric tracking
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

  const iframeRef = useRef(null);

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] font-sans text-white overflow-hidden divide-y divide-white/[0.05]">

      <ComponentToolbar
        onSave={handleSave}
        onOpenVersion={() => setVersionOpen(true)}
        componentName={draft.activeFile.replace(".jsx", "")}
      />

      <div className="flex flex-1 overflow-hidden select-none">

        {/* Left Panel: File Explorer */}
        <aside style={{ width: `${leftWidth}px` }} className="shrink-0 bg-[#0a0a0c] overflow-y-auto">
          <FileExplorer
            files={draft.files}
            selected={draft.activeFile}
            setSelected={(name) => updateDraft("activeFile", name)}
          />
        </aside>

        {/* Resizer Handle Left */}
        <div
          onMouseDown={handleLeftResize}
          className="w-1 hover:w-1.5 bg-transparent hover:bg-purple-500/50 cursor-col-resize transition-all shrink-0 active:bg-purple-500"
        />

        {/* Center Panel: Main Source Code Editor */}
        <main className="flex-1 bg-[#050505] relative flex flex-col min-w-0">
          <MonacoEditor code={currentFile.code} setCode={updateCode} />
        </main>

        {/* Resizer Handle Right */}
        <div
          onMouseDown={handleRightResize}
          className="w-1 hover:w-1.5 bg-transparent hover:bg-purple-500/50 cursor-col-resize transition-all shrink-0 active:bg-purple-500"
        />

        {/* Right Panel: Enhanced Live Preview & Settings Canvas */}
        <aside style={{ width: `${rightWidth}px` }} className="shrink-0 bg-[#0a0a0c] flex flex-col divide-y divide-white/[0.05] min-w-0">

          {/* Top Frame Segment: Interactive Screen Responsive Viewport */}
          <div className="flex-1 relative flex flex-col bg-[#111113]">

            {/* Viewport Scale Control Strip */}
            <div className="w-full px-4 py-2 bg-[#0a0a0c] border-b border-white/[0.05] flex items-center justify-between z-10 shrink-0">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Responsive Viewport
              </span>

              {/* Presets Button Array */}
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
                <button
                  onClick={() => setDeviceMode("desktop")}
                  className={`p-1.5 rounded-md transition-all ${deviceMode === "desktop" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"}`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode("tablet")}
                  className={`p-1.5 rounded-md transition-all ${deviceMode === "tablet" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"}`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode("mobile")}
                  className={`p-1.5 rounded-md transition-all ${deviceMode === "mobile" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode("custom")}
                  className={`p-1.5 rounded-md transition-all ${deviceMode === "custom" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"}`}
                  title="Free Resize Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dynamic Iframe Centered Canvas Housing */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative">
              <div
                ref={iframeRef}
                style={{ width: frameWidth }}
                className="h-full relative transition-all duration-200 shadow-2xl bg-white border border-white/[0.05] rounded-xl overflow-hidden"
              >
                <PreviewPanel code={currentFile.code} />

                {/* Visual Drag Adjuster Handle (Active during manual view modes) */}
                {deviceMode === "custom" && (
                  <div
                    onMouseDown={handleFrameResize}
                    className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-12 bg-purple-600 hover:bg-purple-500 rounded-l-md border-l border-y border-purple-400/30 flex items-center justify-center cursor-ew-resize active:scale-95 transition-all z-50"
                  >
                    <MoveHorizontal className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Viewport Dimension Metadata Tag */}
            <div className="bg-[#0a0a0c]/80 text-[10px] text-center font-mono py-1 border-t border-white/[0.03] text-white/30 tracking-wide shrink-0">
              Width Constraint: {frameWidth === "100%" ? "Fluid (100%)" : frameWidth}
            </div>
          </div>

          {/* Bottom Frame Segment: Parameter Settings Panel */}
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