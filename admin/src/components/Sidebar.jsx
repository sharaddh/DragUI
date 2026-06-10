import {
  LayoutDashboard,
  Boxes,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";
<Link
  to="/marketplace"
>
  Marketplace
</Link>

export default function Sidebar() {

  return (

    <aside className="w-72 bg-black text-white">

      <div className="p-6 text-2xl font-bold">
        DropUI
      </div>

      <nav>
        <Link
          to="/collaboration"
          className="
 flex
 gap-3
 p-4
 "
        >

          Collaboration

        </Link>
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
        <Link
          to="/ai-studio"
        >
          AI Studio
        </Link>
        <Link
          to="/marketplace"
          className="flex gap-3 p-4"
        >
          <Boxes />
          Marketplace
        </Link>

      </nav>

    </aside>

  );

}