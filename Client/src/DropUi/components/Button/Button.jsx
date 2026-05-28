import React from "react";

const ButtonComponent = React.forwardRef(({
  text = "Button",
  className = "",
  ...props
}, ref) => {
  return (
    <button ref={ref} className={className} {...props}>
      {text}
    </button>
  );
});

ButtonComponent.displayName = "Button";

export const Button = React.memo(ButtonComponent);