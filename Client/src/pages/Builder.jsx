import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import PropertiesPanelAdvanced from "../components/PropertiesPanelAdvanced";
import SaveButton from "../components/SaveButton";
import { useBuilderStore } from "../store/useBuilderStore";

export default function Builder() {
  const addComponent = useBuilderStore((s) => s.addComponent);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const tree = useBuilderStore((s) => s.tree);
  const [projectName, setProjectName] = useState("My Project");
  const [activeDrag, setActiveDrag] = useState(null);
  
  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = ({ active }) => {
    console.log("🚀 handleDragStart:", active);
    setActiveDrag(active.data.current);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveDrag(null);

    console.log("🔥 handleDragEnd called:", { active, over });

    if (!over) {
      console.log("❌ No over detected");
      return;
    }

    const payload = active.data.current;
    console.log("🔥 Payload:", payload);
    
    if (!payload || !payload.type) {
      console.log("❌ Invalid payload");
      return;
    }

    // Allow drops to canvas or any container
    const parentId = over.id === "canvas" ? "root" : over.id;
    console.log("🔥 Adding component to parent:", parentId);

    addComponent(parentId, {
      id: Date.now().toString(),
      type: payload.type,
      props: { ...payload.props },
      children: [],
    });
  };

  const handleDragCancel = () => setActiveDrag(null);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-slate-600">
                Project name
              </label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="Enter project name"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <SaveButton projectName={projectName} />
              <button
                type="button"
                onClick={undo}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={redo}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Redo
              </button>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid gap-4 xl:grid-cols-[320px_1fr_320px]">
            <Sidebar />
            <Canvas tree={tree} />
            <PropertiesPanelAdvanced />
          </div>

          <DragOverlay>
            {activeDrag ? (
              <div className="pointer-events-none rounded-2xl border border-cyan-400 bg-cyan-500/90 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20">
                {activeDrag.type}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
