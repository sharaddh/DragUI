import React from "react";

const ContainerComponent = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

ContainerComponent.displayName = "Container";

export const Container = React.memo(ContainerComponent);