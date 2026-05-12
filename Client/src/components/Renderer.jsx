import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";
import { useDroppable } from "@dnd-kit/core";

export default function Renderer({ node }) {
  const { selectedId, selectComponent } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({ id: node.id });

  const isRoot = node.id === "root";
  const isUnknown = !components[node.type];
  const Comp = components[node.type] || "div";

  const handleClick = (e) => {
    e.stopPropagation();
    if (isRoot) return;
    selectComponent(node.id);
  };

  // CSS-only properties that should not be spread as DOM attributes
  const CSS_STYLE_KEYS = [
    "color",
    "backgroundColor",
    "fontSize",
    "textAlign",
    "fontWeight",
    "padding",
    "margin",
    "width",
    "height",
    "display",
    "border",
    "borderRadius",
    "boxShadow",
    "minHeight",
  ];

  // Extract CSS props from node.props
  const cssProps = {
    color: node.props?.color,
    backgroundColor: node.props?.backgroundColor,
    fontSize: node.props?.fontSize ? mapFontSize(node.props.fontSize) : undefined,
    textAlign: node.props?.textAlign,
    fontWeight: node.props?.fontWeight,
    padding: node.props?.padding,
    margin: node.props?.margin,
    width: node.props?.width,
    height: node.props?.height,
    display: node.props?.display,
    border: node.props?.border,
    borderRadius: node.props?.borderRadius,
    boxShadow: node.props?.boxShadow,
    minHeight: node.props?.minHeight,
  };

  // Filter out undefined values
  const cleanCssProps = Object.fromEntries(
    Object.entries(cssProps).filter(([_, v]) => v !== undefined)
  );

  const style = {
    ...cleanCssProps,
    outline: selectedId === node.id ? "2px solid #06b6d4" : "none",
    backgroundColor: isOver && node.type === "Container" ? "#e0f2fe" : cleanCssProps.backgroundColor,
    cursor: isRoot ? "default" : "pointer",
    userSelect: "none",
    minHeight: isUnknown ? "64px" : undefined,
    minWidth: isUnknown ? "120px" : undefined,
    border: isUnknown ? "1px dashed #f59e0b" : cleanCssProps.border,
    padding: isUnknown ? "12px" : undefined,
  };

  // Filter out CSS props from regular props to avoid DOM attribute warnings
  const domProps = Object.fromEntries(
    Object.entries(node.props || {}).filter(([key]) => !CSS_STYLE_KEYS.includes(key) && key !== "children")
  );

  return (
    <Comp
      ref={setNodeRef}
      {...domProps}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      style={style}
      className={`${node.props?.className || ""} ${
        selectedId === node.id ? "outline-2" : ""
      } ${isOver && node.type === "Container" ? "outline-2 outline-cyan-400" : ""}`}
    >
      {isUnknown && !node.children?.length ? (
        <div className="text-xs text-slate-500">Unknown component: {node.type}</div>
      ) : null}
      {node.children?.map((child) => (
        <Renderer key={child.id} node={child} />
      ))}
    </Comp>
  );
}

function mapFontSize(size) {
  const sizeMap = {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  };
  return sizeMap[size] || size;
}