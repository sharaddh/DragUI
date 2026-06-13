import { apiRequest } from "../utils/api.js";
import fetch from "node-fetch";
import { detectProjectType } from "../utils/detect.js";
import fs from "fs-extra";

export default async function pull(...args) {
  const projectId = args.join(" ").trim();

  if (!projectId) {
    console.log("âŒ Please provide project ID or name");
    return;
  }

  console.log("â¬‡ï¸ Fetching project...");

  let data;
  try {
    // First attempt: public project by uniqueId (no auth required)
    try {
      const publicRes = await fetch(`http://localhost:5000/api/project/public/${projectId}`);
      if (publicRes.ok) {
        data = await publicRes.json();
      } else if (publicRes.status !== 404) {
        // other error (e.g., 500) — throw to outer handler
        const errText = await publicRes.text();
        throw new Error(errText || `HTTP ${publicRes.status}`);
      }
    } catch (err) {
      // fallback to authenticated endpoint
      data = await apiRequest(`/project/${projectId}`);
    }
  } catch (err) {
    console.log(`âŒ ${err.message}`);
    return;
  }

  if (!data || !data.design) {
    console.log("âŒ Project design not found");
    return;
  }

  const type = detectProjectType();
  console.log(`ðŸ“¦ Project: ${data.name}`);
  console.log(`ðŸ“ Current dir: ${type}`);

  if (type === "frontend") {
    const componentCode = generateComponent(data.design);
    fs.ensureDirSync("src");
    fs.writeFileSync("src/GeneratedUI.jsx", componentCode);

    ensureDropUiPackage();
    clearViteCache();

    console.log("âœ… Generated UI component saved to src/GeneratedUI.jsx");
    console.log("âœ… Local DropUi package created in node_modules/DropUi");
    console.log("âœ… Vite cache cleared - ready to run npm run dev");
  } else if (type === "backend") {
    fs.ensureDirSync("routes");
    fs.writeFileSync("routes/generated.json", JSON.stringify(data.design, null, 2));
    console.log("âœ… Design JSON saved to routes/generated.json");
  } else {
    console.log("âŒ Unknown project type. Run this from a frontend or backend directory.");
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
  const CSS_STYLE_KEYS = new Set([
    'color',
    'background',
    'backgroundColor',
    'fontSize',
    'textAlign',
    'fontWeight',
    'fontStyle',
    'letterSpacing',
    'lineHeight',
    'padding',
    'margin',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'display',
    'gap',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'alignContent',
    'flexWrap',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'zIndex',
    'overflow',
    'overflowX',
    'overflowY',
    'border',
    'borderRadius',
    'boxShadow',
  ]);

  function sanitizeName(name) {
    let safe = String(name || '').trim().replace(/[^A-Za-z0-9_$]/g, '_');
    if (/^[0-9]/.test(safe)) safe = `_${safe}`;
    if (!safe) safe = 'CustomComponent';
    return safe;
  }

  function getComponentName(code) {
    const functionMatch = code.match(/(?:export\\s+default\\s+function|export\\s+function|function)\\s+([A-Za-z0-9_]+)/);
    const constMatch = code.match(/(?:export\\s+const|const)\\s+([A-Za-z0-9_]+)\\s*=/);
    const arrowMatch = code.match(/(?:export\\s+const|const)?\\s*([A-Za-z0-9_]+)\\s*=\\s*\\(.*\\)\\s*=>/);
    return (functionMatch || constMatch || arrowMatch)?.[1] || null;
  }

  function collectTemplates(node, map = new Map()) {
    if (!node) return map;
    if (node.template && !map.has(node.type)) {
      map.set(node.type, node.template);
    }
    node.children?.forEach((child) => collectTemplates(child, map));
    return map;
  }

  function normalizeTemplateDefinition(type, template) {
    const safeName = sanitizeName(type);
    const raw = template.trim();
    const cleaned = raw.replace(/\\bexport\\s+(default\\s+)?/, "");
    const originalName = getComponentName(cleaned);

    if (originalName && cleaned.includes(originalName)) {
      if (originalName === safeName) {
        return cleaned;
      }
      return `${cleaned}\n\nconst ${safeName} = (props) => <${originalName} {...props} />;`;
    }

    if (cleaned.startsWith("<")) {
      return `const ${safeName} = (props) => (${cleaned});`;
    }

    return `const ${safeName} = (props) => (${cleaned});`;
  }

  function getStyleObject(props = {}) {
    const styleObj = {};
    Object.entries(props).forEach(([key, value]) => {
      if (CSS_STYLE_KEYS.has(key)) {
        styleObj[key] = value;
      }
    });
    if (Object.keys(styleObj).length === 0) return null;
    return `{${Object.entries(styleObj)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ')}}`;
  }

  function generateProps(props = {}) {
    return Object.entries(props)
      .filter(([key, value]) => value !== undefined && key !== 'className' && !CSS_STYLE_KEYS.has(key))
      .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
      .join(' ');
  }

  function renderNode(node, templateMap) {
    if (!node) return '';

    if (node.type === 'div') {
      const children = node.children?.map((child) => renderNode(child, templateMap)).join('\n') || '';
      const styleProps = getStyleObject(node.props);
      const styleAttr = styleProps ? ` style={${styleProps}}` : '';
      const classAttr = node.props?.className ? ` className="${node.props.className}"` : '';
      return `<div${classAttr}${styleAttr}>\n${children}\n</div>`;
    }

    if (node.type === 'Button') {
      const children = node.children?.map((child) => renderNode(child, templateMap)).join('\n') || '';
      const classAttr = node.props?.className ? ` className="${node.props.className}"` : '';
      const styleProps = getStyleObject(node.props);
      const styleAttr = styleProps ? ` style={${styleProps}}` : '';
      const propsString = generateProps(node.props);
      if (children) {
        return `<Button${classAttr}${styleAttr}${propsString ? ` ${propsString}` : ''}>${children}</Button>`;
      }
      return `<Button${classAttr}${styleAttr}${propsString ? ` ${propsString}` : ''} />`;
    }

    if (node.type === 'Container') {
      const children = node.children?.map((child) => renderNode(child, templateMap)).join('\n') || '';
      const classAttr = node.props?.className ? ` className="${node.props.className}"` : '';
      const styleProps = getStyleObject(node.props);
      const styleAttr = styleProps ? ` style={${styleProps}}` : '';
      return `<Container${classAttr}${styleAttr}>${children}</Container>`;
    }

    if (templateMap.has(node.type)) {
      const safeName = sanitizeName(node.type);
      const classAttr = node.props?.className ? ` className="${node.props.className}"` : '';
      const styleProps = getStyleObject(node.props);
      const styleAttr = styleProps ? ` style={${styleProps}}` : '';
      const childContent = node.children?.map((child) => renderNode(child, templateMap)).join('\n') || '';
      const propsString = generateProps(node.props);
      if (childContent) {
        return `<${safeName}${classAttr}${styleAttr}${propsString ? ` ${propsString}` : ''}>\n${childContent}\n</${safeName}>`;
      }
      return `<${safeName}${classAttr}${styleAttr}${propsString ? ` ${propsString}` : ''} />`;
    }

    const children = node.children?.map((child) => renderNode(child, templateMap)).join('\n') || '';
    const styleProps = getStyleObject(node.props);
    const styleAttr = styleProps ? ` style={${styleProps}}` : '';
    const classAttr = node.props?.className ? ` className="${node.props.className}"` : '';
    return `<div${classAttr}${styleAttr}>\n${children}\n</div>`;
  }

  function buildTemplateDefinitions(templateMap) {
    return [...templateMap.entries()]
      .map(([type, template]) => normalizeTemplateDefinition(type, template))
      .join('\n\n');
  }

  const templateMap = collectTemplates(design);
  const templateDefinitions = buildTemplateDefinitions(templateMap);
  const importLine = `import { Button, Container } from 'DropUi';\n\n`;
  const body = Array.isArray(design) ? design.map((node) => renderNode(node, templateMap)).join('\n') : renderNode(design, templateMap);

  const componentRegistryEntries = [
    `  Button,`,
    `  button: Button,`,
    `  Container,`,
    `  container: Container,`,
    ...[...templateMap.entries()].map(([type]) => {
      const safeName = sanitizeName(type);
      return `  ${JSON.stringify(type)}: ${safeName},`;
    }),
  ];
  const componentRegistry = componentRegistryEntries.join('\n');

  return `// Auto-generated component from DropUI\n// Generated: ${new Date().toISOString()}\n\nimport React from 'react';\n${importLine}${templateDefinitions}\n\nconst GeneratedUI = () => {\n  const design = ${JSON.stringify(design)};\n  const nodes = Array.isArray(design) ? design : design?.children || [];\n\n  return (\n    <div className="generated-ui">\n      {nodes.map((node) => (\n        <Renderer key={node.id} node={node} />\n      ))}\n    </div>\n  );\n};\n\nconst componentRegistry = {\n  Button,\n  button: Button,\n  Container,\n  container: Container,\n${componentRegistry}\n};\n\nconst CSS_STYLE_KEYS = new Set([\n  'color',\n  'backgroundColor',\n  'fontSize',\n  'textAlign',\n  'fontWeight',\n  'padding',\n  'margin',\n  'width',\n  'height',\n  'display',\n  'border',\n  'borderRadius',\n  'boxShadow',\n]);\n\nconst Renderer = ({ node }) => {\n  if (!node) return null;\n\n  const Comp = componentRegistry[node.type] || 'div';\n  const isKnownComponent = !!componentRegistry[node.type];\n\n  const cssProps = {};\n  const domProps = {};\n  Object.entries(node.props || {}).forEach(([key, value]) => {\n    if (CSS_STYLE_KEYS.has(key)) {\n      cssProps[key] = value;\n    } else {\n      domProps[key] = value;\n    }\n  });\n\n  const style = Object.keys(cssProps).length > 0 ? cssProps : undefined;\n\n  return (\n    <Comp \n      {...domProps} \n      style={style}\n      className={node.props?.className || ''}\n    >\n      {!isKnownComponent ? (\n        <div style={{ padding: 12, border: '1px dashed #f59e0b', borderRadius: 16, background: '#fef3c7', marginBottom: 12, color: '#92400e', fontSize: 14 }}>\n          Custom component: {node.type}\n        </div>\n      ) : null}\n      {node.children?.map((child) => (\n        <Renderer key={child.id} node={child} />\n      ))}\n    </Comp>\n  );\n};\n\nexport default GeneratedUI;\n`; 
}
