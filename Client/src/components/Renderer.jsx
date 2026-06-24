// import React from "react";
// import { useBuilderStore } from "../store/useBuilderStore";
// import { components } from "../DropUi/index";
// import { useDroppable } from "@dnd-kit/core";
// import { LiveProvider, LivePreview, LiveError } from "react-live";

// function getComponentName(code) {
//   const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
//   const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
//   const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
//   return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
// }

// function getPreviewCode(code, props = {}) {
//   const trimmed = code?.trim();
//   if (!trimmed) return "";
//   const componentName = getComponentName(trimmed);
  
//   // Filter out CSS-only properties to avoid DOM attribute warnings
//   const CSS_STYLE_KEYS = new Set([
//     "color",
//     "backgroundColor",
//     "fontSize",
//     "textAlign",
//     "fontWeight",
//     "padding",
//     "margin",
//     "width",
//     "height",
//     "display",
//     "border",
//     "borderRadius",
//     "boxShadow",
//     "minHeight",
//     "maxHeight",
//     "minWidth",
//     "maxWidth",
//     "gap",
//     "flexDirection",
//     "justifyContent",
//     "alignItems",
//     "alignContent",
//     "flexWrap",
//   ]);

//   const cleanProps = {};
//   Object.entries(props || {}).forEach(([key, value]) => {
//     if (!CSS_STYLE_KEYS.has(key)) {
//       cleanProps[key] = value;
//     }
//   });
  
//   const propsObject = JSON.stringify(cleanProps || {});

//   if (trimmed.includes("render(")) {
//     return trimmed;
//   }

//   return `${trimmed}\n\nrender(<${componentName} {...${propsObject}} />);`;
// }

// export default function Renderer({ node }) {
//   const { selectedId, selectComponent } = useBuilderStore();
//   const { setNodeRef, isOver } = useDroppable({ id: node.id });

//   const isRoot = node.id === "root";
//   const isUnknown = !components[node.type];
//   const hasTemplate = !!node.template;
//   const Comp = components[node.type] || "div";

//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (isRoot) return;
//     selectComponent(node.id);
//   };

//   // CSS-only properties that should not be spread as DOM attributes
//   const CSS_STYLE_KEYS = new Set([
//     "color",
//     "backgroundColor",
//     "fontSize",
//     "textAlign",
//     "fontWeight",
//     "padding",
//     "margin",
//     "width",
//     "height",
//     "display",
//     "border",
//     "borderRadius",
//     "boxShadow",
//     "minHeight",
//     "maxHeight",
//     "minWidth",
//     "maxWidth",
//     "gap",
//     "flexDirection",
//     "justifyContent",
//     "alignItems",
//     "alignContent",
//     "flexWrap",
//   ]);

//   const { style: nodeCustomStyle, className, ...rawProps } = node.props || {};
//   const cssProps = {};
//   const domProps = {};

//   Object.entries(rawProps).forEach(([key, value]) => {
//     if (CSS_STYLE_KEYS.has(key)) {
//       cssProps[key] = key === "fontSize" ? mapFontSize(value) : value;
//     } else {
//       domProps[key] = value;
//     }
//   });

//   const cleanCssProps = Object.fromEntries(
//     Object.entries(cssProps).filter(([, value]) => value !== undefined)
//   );

//   const style = {
//     ...nodeCustomStyle,
//     ...cleanCssProps,
//     outline: !isRoot && selectedId === node.id ? "2px solid #06b6d4" : "none",
//     backgroundColor: isOver && node.type === "Container" ? "#e0f2fe" : nodeCustomStyle?.backgroundColor ?? cleanCssProps.backgroundColor,
//     cursor: isRoot ? "default" : "pointer",
//     userSelect: "none",
//     minHeight: !isRoot && isUnknown ? "64px" : undefined,
//     minWidth: !isRoot && isUnknown ? "120px" : undefined,
//     border: !isRoot && isUnknown ? "1px dashed #f59e0b" : cleanCssProps.border,
//     padding: !isRoot && isUnknown ? "12px" : undefined,
//   };

//   const domPropsWithoutStyle = Object.fromEntries(
//     Object.entries(domProps).filter(([key]) => key !== "style")
//   );

//   const componentClassName = [
//     className, 
//     !isRoot && selectedId === node.id ? "outline-2" : "", 
//     isOver && node.type === "Container" && !isRoot ? "outline-2 outline-cyan-400" : ""
//   ]
//     .filter(Boolean)
//     .join(" ");

//   const previewCode = hasTemplate ? getPreviewCode(node.template, node.props) : "";

//   return (
//     <Comp
//       ref={setNodeRef}
//       {...domPropsWithoutStyle}
//       onClick={handleClick}
//       onMouseDown={(e) => e.stopPropagation()}
//       style={style}
//       className={componentClassName}
//     >
//       {isUnknown && hasTemplate ? (
//         <div onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}>
//           <LiveProvider code={previewCode} scope={{ React }} noInline>
//             <LivePreview />
//             <LiveError className="text-red-500 mt-2 text-xs" />
//           </LiveProvider>
//         </div>
//       ) : null}
//       {node.children?.map((child) => (
//         <Renderer key={child.id} node={child} />
//       ))}
//     </Comp>
//   );
// }

// function mapFontSize(size) {
//   const sizeMap = {
//     xs: "12px",
//     sm: "14px",
//     base: "16px",
//     lg: "18px",
//     xl: "20px",
//     "2xl": "24px",
//     "3xl": "30px",
//   };
//   return sizeMap[size] || size;
// }
import React, { useMemo } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";
import { useDroppable } from "@dnd-kit/core";
import { LiveProvider, LivePreview, LiveError } from "react-live";

// 1. HOIST STATIC UTILITIES TO PREVENT RERENDER MEMORY LEAKS
const CSS_STYLE_KEYS = new Set([
  "color", "backgroundColor", "fontSize", "textAlign", "fontWeight",
  "padding", "margin", "width", "height", "display", "border",
  "borderRadius", "boxShadow", "minHeight", "maxHeight", "minWidth",
  "maxWidth", "gap", "flexDirection", "justifyContent", "alignItems",
  "alignContent", "flexWrap", "paddingTop", "paddingRight", "paddingBottom",
  "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft"
]);

const SIZE_MAP = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
};

function mapFontSize(size) {
  return SIZE_MAP[size] || size;
}

function getComponentName(code) {
  const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
  const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
  const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
  return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
}

function getPreviewCode(code, props = {}) {
  const trimmed = code?.trim();
  if (!trimmed) return "";
  const componentName = getComponentName(trimmed);

  const cleanProps = {};
  Object.entries(props || {}).forEach(([key, value]) => {
    if (!CSS_STYLE_KEYS.has(key)) {
      cleanProps[key] = value;
    }
  });

  const propsObject = JSON.stringify(cleanProps);

  if (trimmed.includes("render(")) {
    return trimmed;
  }

  return `${trimmed}\n\nrender(<${componentName} {...${propsObject}} />);`;
}

// 2. MAIN RENDER ENGINE COMPONENT
export default function Renderer({ node }) {
  const selectedId = useBuilderStore((s) => s.selectedId);
  const selectComponent = useBuilderStore((s) => s.selectComponent);
  
  const { setNodeRef, isOver } = useDroppable({ id: node.id });

  const isRoot = node.id === "root";
  const isUnknown = !components[node.type];
  const hasTemplate = !!node.template;
  const Comp = components[node.type] || "div";

  const handleClick = (e) => {
    e.stopPropagation();
    if (isRoot) return;
    selectComponent(node.id);
  };

  // Extract raw styling structures safely
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

  // 3. DEFENSIVE VISUAL FEEDBACK MATRIX (No longer crushes layout styles)
  const style = {
    ...nodeCustomStyle,
    ...cleanCssProps,
    outline: !isRoot && selectedId === node.id ? "2px solid #06b6d4" : undefined,
    backgroundColor: isOver && node.type === "Container" ? "#e0f2fe" : (nodeCustomStyle?.backgroundColor ?? cleanCssProps.backgroundColor),
    cursor: isRoot ? "default" : "pointer",
    userSelect: "none",
    
    // Fallback placeholders apply ONLY if the user hasn't specified custom bounds yet
    minHeight: cleanCssProps.minHeight || (!isRoot && isUnknown ? "64px" : undefined),
    minWidth: cleanCssProps.minWidth || (!isRoot && isUnknown ? "120px" : undefined),
    border: cleanCssProps.border || (!isRoot && isUnknown ? "1px dashed #f59e0b" : undefined),
    padding: cleanCssProps.padding || (!isRoot && isUnknown && !cleanCssProps.paddingTop ? "12px" : undefined),
  };

  const domPropsWithoutStyle = Object.fromEntries(
    Object.entries(domProps).filter(([key]) => key !== "style")
  );

  const componentClassName = [
    className,
    !isRoot && selectedId === node.id ? "ring-2 ring-cyan-500 ring-offset-1" : "",
    isOver && node.type === "Container" && !isRoot ? "ring-2 ring-cyan-400 bg-sky-50/50" : ""
  ]
    .filter(Boolean)
    .join(" ");

  // Memoize source string variations to stop react-live component flicker loops
  const previewCode = useMemo(() => {
    return hasTemplate ? getPreviewCode(node.template, node.props) : "";
  }, [hasTemplate, node.template, node.props]);

  return (
    <Comp
      ref={setNodeRef}
      {...domPropsWithoutStyle}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      style={style}
      className={componentClassName}
    >
      {isUnknown && hasTemplate ? (
        <div className="w-full h-full pointer-events-none">
          <LiveProvider code={previewCode} scope={{ React }} noInline>
            <LivePreview />
            <LiveError className="text-red-500 mt-2 text-xs font-mono p-2 bg-red-50 rounded-lg pointer-events-auto" />
          </LiveProvider>
        </div>
      ) : null}
      
      {node.children?.map((child) => (
        <Renderer key={child.id} node={child} />
      ))}
    </Comp>
  );
}