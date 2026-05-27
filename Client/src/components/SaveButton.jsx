import { saveProject } from "../api/Project";
import { useBuilderStore } from "../store/useBuilderStore";

export default function SaveButton({ projectName }) {
  const tree = useBuilderStore((s) => s.tree);

  const save = async () => {
    if (!projectName) {
      alert("Please enter a project name before saving.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      return;
    }

    try {
      await saveProject(
        {
          name: projectName,
          design: tree,
        },
        token
      );
      alert("Saved successfully");
    } catch (error) {
      console.error(error);
      alert("Save failed. Check the server and try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={save}
      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
    >
      Save project
    </button>
  );
}