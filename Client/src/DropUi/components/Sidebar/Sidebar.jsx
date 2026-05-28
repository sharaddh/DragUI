import React from "react";

const SidebarComponent = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={`bg-red-700 rounded-4xl ${className}`} {...props}>
      {children || "Sidebar"}
    </div>
  );
});

SidebarComponent.displayName = "Sidebar";

export const Sidebar = React.memo(SidebarComponent);
