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
  const CSS_STYLE_KEYS = new Set([
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
    "maxHeight",
    "minWidth",
    "maxWidth",
    "gap",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "alignContent",
    "flexWrap",
  ]);

  const { style: nodeCustomStyle, className, ...rawProps } = node.props || {};
  const cssProps = {};
  const domProps = {};

  Object.entries(rawProps).forEach(([key, value]) => {
    if (CSS_STYLE_KEYS.has(key)) {
      cssProps[key] = key === "fontSize" ? mapFontSize(value) : value;
    } else {
      domProps[key] = value;
    }
  });

  const cleanCssProps = Object.fromEntries(
    Object.entries(cssProps).filter(([, value]) => value !== undefined)
  );

  const style = {
    ...nodeCustomStyle,
    ...cleanCssProps,
    outline: selectedId === node.id ? "2px solid #06b6d4" : "none",
    backgroundColor: isOver && node.type === "Container" ? "#e0f2fe" : nodeCustomStyle?.backgroundColor ?? cleanCssProps.backgroundColor,
    cursor: isRoot ? "default" : "pointer",
    userSelect: "none",
    minHeight: isUnknown ? "64px" : undefined,
    minWidth: isUnknown ? "120px" : undefined,
    border: isUnknown ? "1px dashed #f59e0b" : cleanCssProps.border,
    padding: isUnknown ? "12px" : undefined,
  };

  const domPropsWithoutStyle = Object.fromEntries(
    Object.entries(domProps).filter(([key]) => key !== "style")
  );

  const componentClassName = [className, selectedId === node.id ? "outline-2" : "", isOver && node.type === "Container" ? "outline-2 outline-cyan-400" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Comp
      ref={setNodeRef}
      {...domPropsWithoutStyle}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      style={style}
      className={componentClassName}
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