import {
  LayoutDashboard,
  Boxes,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function Sidebar() {

  return (

    <aside className="w-72 bg-black text-white">

      <div className="p-6 text-2xl font-bold">
        DropUI
      </div>

      <nav>

        <Link
          to="/"
          className="flex gap-3 p-4"
        >
          <LayoutDashboard />
          Dashboard
        </Link>

        <Link
          to="/components"
          className="flex gap-3 p-4"
        >
          <Boxes />
          Components
        </Link>

      </nav>

    </aside>

  );

}