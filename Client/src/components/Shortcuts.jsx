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