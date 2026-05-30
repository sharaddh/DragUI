// import { useEffect } from "react";
// import { useBuilderStore } from "../store/useBuilderStore";

// export default function Shortcuts() {
//   const { undo, redo } = useBuilderStore();

//   useEffect(() => {
//     const handler = (e) => {
//       // Undo → Ctrl + Z
//       if (e.ctrlKey && e.key === "z") {
//         e.preventDefault();
//         undo();
//       }

//       // Redo → Ctrl + Y
//       if (e.ctrlKey && e.key === "y") {
//         e.preventDefault();
//         redo();
//       }
//     };

//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [undo, redo]);

//   return null;
// }
import { useEffect } from "react";
import { useBuilderStore } from "../store/useBuilderStore";

export default function Shortcuts() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);

  useEffect(() => {
    const handler = (e) => {
      // 1. ESCAPE INPUT FIELDS: Prevent undoing canvas nodes when the user is simply typing text
      const targetTag = e.target.tagName.toLowerCase();
      if (
        targetTag === "input" || 
        targetTag === "textarea" || 
        e.target.isContentEditable
      ) {
        return; 
      }

      // 2. DETECT OPERATING SYSTEM: Support Cmd on Mac and Ctrl on Windows/Linux
      const isModifierPressed = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // 3. UNDO CONFIG: Ctrl/Cmd + Z
      if (isModifierPressed && !e.shiftKey && key === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // 4. REDO CONFIG: Ctrl/Cmd + Y  OR  Ctrl/Cmd + Shift + Z (Standard Mac convention)
      const isRedoCombo = 
        (isModifierPressed && key === "y") || 
        (isModifierPressed && e.shiftKey && key === "z");

      if (isRedoCombo) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return null;
}