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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = ({ active }) => {
    const payload = active.data?.current || active.data || null;
    setActiveDrag(payload);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveDrag(null);

    const payload = active.data?.current || active.data;
    const fallbackType = active.id?.startsWith("tool-") ? active.id.split("tool-")[1].split("-")[0] : null;
    const type = payload?.type || fallbackType;
    const props = payload?.props || {};

    const parentId = over?.id === "canvas" ? "root" : over?.id || "root";

    console.log("🔥 handleDragEnd", { activeId: active.id, over, type, parentId, payload });

    if (!type) {
      return;
    }

    addComponent(parentId, {
      id: Date.now().toString(),
      type,
      template: payload.template,
      props: { ...props },
      children: [],
    });
  };

  const handleDragCancel = () => setActiveDrag(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-400 px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-500">Workspace</p>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Design your UI without code</h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Drag components into the canvas, style them with the sidebar, and save your project to continue later.
              </p>
            </div>

            <div className="grid gap-3 sm:auto-rows-fr sm:grid-flow-col sm:grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,auto)]">
              <div>
                <label className="block text-sm font-semibold text-slate-600">Project name</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  placeholder="Enter project name"
                />
              </div>

              <SaveButton projectName={projectName} />

              <div className="flex flex-wrap items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={undo}
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={redo}
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Redo
                </button>
              </div>
            </div>
          </div>
        </section>

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
              <div className="pointer-events-none rounded-2xl border border-cyan-400 bg-cyan-500/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20">
                {activeDrag.type}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
