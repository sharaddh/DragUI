import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Example of your Layout or App.jsx
export default function dminLayout({ children }) {
  return (
    // The bg-[#050505] here fixes the white gap!
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {/* Your routing / Dashboard goes here */}
          {children}
        </main>
      </div>
    </div>
  );
}