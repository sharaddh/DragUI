import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout({
  children,
}) {

  return (

    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>

  );

}