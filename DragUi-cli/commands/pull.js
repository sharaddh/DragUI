import { apiRequest } from "../utils/api.js";
import { detectProjectType } from "../utils/detect.js";
import fs from "fs-extra";

export default async function pull(...args) {
  const projectId = args.join(" ").trim();

  if (!projectId) {
    console.log("❌ Please provide project ID or name");
    return;
  }

  console.log("⬇️ Fetching project...");

  let data;
  try {
    data = await apiRequest(`/project/${projectId}`);
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return;
  }

  if (!data || !data.design) {
    console.log("❌ Project design not found");
    return;
  }

  const type = detectProjectType();
  console.log(`📦 Project: ${data.name}`);
  console.log(`📁 Current dir: ${type}`);

  if (type === "frontend") {
    const componentCode = generateComponent(data.design);
    fs.ensureDirSync("src");
    fs.writeFileSync("src/GeneratedUI.jsx", componentCode);

    ensureDropUiPackage();
    clearViteCache();

    console.log("✅ Generated UI component saved to src/GeneratedUI.jsx");
    console.log("✅ Local DropUi package created in node_modules/DropUi");
    console.log("✅ Vite cache cleared - ready to run npm run dev");
  } else if (type === "backend") {
    fs.ensureDirSync("routes");
    fs.writeFileSync("routes/generated.json", JSON.stringify(data.design, null, 2));
    console.log("✅ Design JSON saved to routes/generated.json");
  } else {
    console.log("❌ Unknown project type. Run this from a frontend or backend directory.");
  }
}

function ensureDropUiPackage() {
  const dropUiRoot = "node_modules/DropUi";
  const indexPath = `${dropUiRoot}/index.js`;

  // Always regenerate to ensure fresh files
  fs.ensureDirSync(dropUiRoot);
  fs.writeFileSync(
    `${dropUiRoot}/package.json`,
    JSON.stringify(
      {
        name: "DropUi",
        version: "1.0.0",
        type: "module",
        main: "index.js",
      },
      null,
      2
    )
  );

  const indexContent = `import React from 'react';

export function Button({ children, text, className = '', ...props }) {
  return React.createElement('button', {
    className: 'rounded-lg bg-cyan-500 px-4 py-2 text-white ' + className,
    ...props
  }, text || children);
}

export function Container({ children, className = '', ...props }) {
  return React.createElement('div', {
    className: 'rounded-3xl border border-slate-200 bg-white p-4 ' + className,
    ...props
  }, children);
}
`;

  fs.writeFileSync(indexPath, indexContent);
}

function clearViteCache() {
  try {
    const viteCachePath = "node_modules/.vite";
    if (fs.existsSync(viteCachePath)) {
      fs.removeSync(viteCachePath);
    }
  } catch (err) {
    // Silently ignore if cache doesn't exist or can't be cleared
  }
}

function generateComponent(design) {
  return `// Auto-generated component from DropUI
// Generated: ${new Date().toISOString()}

import React from 'react';
import { Button, Container } from 'DropUi';

const componentRegistry = {
  Button,
  button: Button,
  Container,
  container: Container,
};

const CSS_STYLE_KEYS = new Set([
  'color',
  'backgroundColor',
  'fontSize',
  'textAlign',
  'fontWeight',
  'padding',
  'margin',
  'width',
  'height',
  'display',
  'border',
  'borderRadius',
  'boxShadow',
]);

const Renderer = ({ node }) => {
  if (!node) return null;

  const Comp = componentRegistry[node.type] || 'div';
  const isKnownComponent = !!componentRegistry[node.type];

  // Separate CSS props from DOM props
  const cssProps = {};
  const domProps = {};
  
  Object.entries(node.props || {}).forEach(([key, value]) => {
    if (CSS_STYLE_KEYS.has(key)) {
      cssProps[key] = value;
    } else {
      domProps[key] = value;
    }
  });

  const style = Object.keys(cssProps).length > 0 ? cssProps : undefined;

  return (
    <Comp 
      {...domProps} 
      style={style}
      className={node.props?.className || ''}
    >
      {!isKnownComponent ? (
        <div style={{ padding: 12, border: '1px dashed #f59e0b', borderRadius: 16, background: '#fef3c7', marginBottom: 12, color: '#92400e', fontSize: 14 }}>
          Custom component: {node.type}
        </div>
      ) : null}
      {node.children?.map((child) => (
        <Renderer key={child.id} node={child} />
      ))}
    </Comp>
  );
};

const GeneratedUI = () => {
  const design = ${JSON.stringify(design)};
  const nodes = Array.isArray(design) ? design : design?.children || [];

  return (
    <div className="generated-ui">
      {nodes.map((node) => (
        <Renderer key={node.id} node={node} />
      ))}
    </div>
  );
};

export default GeneratedUI;
`;
}