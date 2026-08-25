import fs from "fs";
import path from "path";
import axios from "axios";
import { getToken } from "../utils/auth.js";
import { API_BASE as API } from "../utils/config.js";

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const CUSTOM_LIB_IMPORTS = {
  confetti: `import confetti from "canvas-confetti";`,
  motion: `import { motion, AnimatePresence } from "framer-motion";`,
};

// Strip import/export syntax so a stored component source can be inlined
// under a chosen name; reports which external libs it references.
function prepareCustomSource(code, compName) {
  let src = String(code)
    .replace(/import\s+React\s*,\s*\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+React\s+from\s*['"]react['"];?/g, "")
    .replace(/^\s*import[^\n]*$/gm, "");
  src = src.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ");

  const uses = {};
  if (/\bconfetti\b/.test(src)) uses.confetti = true;
  if (/\bmotion\b|\bAnimatePresence\b/.test(src)) uses.motion = true;

  const patterns = [
    [/export\s+default\s+function\s+(\w+)/, (m) => [`export default function ${m[1]}`, `function ${compName}`]],
    [/export\s+default\s+(const|let|var)\s+(\w+)/, (m) => [`export default ${m[1]} ${m[2]}`, `${m[1]} ${compName}`]],
    [/export\s+default\s+/, () => ["export default", `const ${compName} =`]],
  ];
  let replaced = false;
  for (const [re, make] of patterns) {
    const m = src.match(re);
    if (m) {
      const [from, to] = make(m);
      src = src.replace(from, to);
      replaced = true;
      break;
    }
  }
  if (!replaced) return null;
  return { src, uses };
}

function collectCustomNodes(design) {
  const found = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.code) found.push(node);
    (node.children || []).forEach(walk);
  };
  walk(design);
  return found;
}

function styleToInline(style) {
  if (!style || !Object.keys(style).length) return "";
  return Object.entries(style)
    .map(([key, val]) => {
      if (!val && val !== 0) return null;
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}: ${val}`;
    })
    .filter(Boolean)
    .join("; ");
}

function renderNode(node, customMap) {
  if (!node) return "";
  if (node.type === "root") {
    return (node.children || []).map((c) => renderNode(c, customMap)).join("\n");
  }

  const p = node.props || {};
  const style = p.style || {};
  const inline = styleToInline(style);
  const cls = p.className || "";
  const attrs = ` class="${cls}"${inline ? ` style="${inline}"` : ""}`;
  const children = (node.children || []).map((c) => renderNode(c, customMap)).join("\n");

  if (node.code && customMap) {
    const ref = customMap.get(node);
    return `<div data-dropui-custom="${ref}"${attrs}></div>`;
  }

  switch (node.type) {
    case "heading": {
      const level = p.level || "h2";
      return `<${level}${attrs}>${escapeHtml(p.text || "")}</${level}>`;
    }
    case "text":
      return `<span${attrs}>${escapeHtml(p.text || "")}</span>`;
    case "paragraph":
      return `<p${attrs}>${escapeHtml(p.text || "")}</p>`;
    case "button":
      return `<button${attrs}>${escapeHtml(p.text || "Button")}</button>`;
    case "link":
      return `<a href="${escapeHtml(p.href || "#")}"${attrs}>${escapeHtml(p.text || "Link")}</a>`;
    case "image":
      return `<img src="${escapeHtml(p.src || "")}" alt="${escapeHtml(p.alt || "")}"${attrs} />`;
    case "input":
      return `<div>\n${p.label ? `  <label>${escapeHtml(p.label)}</label>\n` : ""}  <input type="${p.type || "text"}" placeholder="${escapeHtml(p.placeholder || "")}" />\n</div>`;
    case "divider":
      return `<hr${attrs} />`;
    case "list": {
      const tag = p.ordered ? "ol" : "ul";
      const items = (p.items || []).map((item) => `  <li>${escapeHtml(item)}</li>`).join("\n");
      return `<${tag}${attrs}>\n${items}\n</${tag}>`;
    }
    case "video":
      return `<div${attrs}>\n  <iframe src="${escapeHtml(p.src || "")}" style="width:100%;height:100%;min-height:200px;border:none" allowFullScreen></iframe>\n</div>`;
    default:
      return `<div${attrs}>\n${p.text ? `  ${escapeHtml(p.text)}\n` : ""}${children ? children + "\n" : ""}</div>`;
  }
}

function generateHtml(design, projectName) {
  const customNodes = collectCustomNodes(design);
  const customMap = new Map();
  customNodes.forEach((node, i) => customMap.set(node, `c${i + 1}`));

  let body = "";
  if (Array.isArray(design)) {
    body = design.map((n) => renderNode(n, customMap)).join("\n");
  } else if (design?.children) {
    body = (design.children || []).map((n) => renderNode(n, customMap)).join("\n");
  } else if (design?.type) {
    body = renderNode(design, customMap);
  }

  // Custom admin components need a live runtime - mount them via Babel standalone
  let customScript = "";
  if (customNodes.length) {
    const sources = [];
    const mounts = [];
    const libUsed = new Set();

    customNodes.forEach((node, i) => {
      const ref = customMap.get(node);
      const prepared = prepareCustomSource(node.code, `Custom_${i + 1}`);
      if (!prepared) return;
      Object.keys(prepared.uses).forEach((k) => libUsed.add(k));
      sources.push(`// ${node.label || node.type}\n${prepared.src}`);

      const propsJson = JSON.stringify(node.props || {}).replace(/</g, "\\u003c");
      mounts.push(
        `ReactDOM.createRoot(document.querySelector('[data-dropui-custom="${ref}"]'))` +
          `.render(React.createElement(Custom_${i + 1}, ${propsJson}));`
      );
    });

    const libScripts = [];
    const libAliases = [];
    if (libUsed.has("motion")) {
      // v6 is the last line with a browser-ready UMD build (global: Motion)
      libScripts.push(`  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/framer-motion@6/dist/framer-motion.js"></script>`);
      libAliases.push(`const { motion, AnimatePresence } = window.Motion || {};`);
    } else {
      libScripts.push(`  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>`);
    }
    if (libUsed.has("confetti")) {
      libScripts.push(`  <script crossorigin src="https://cdn.jsdelivr.net/npm/canvas-confetti@1/dist/confetti.browser.min.js"></script>`);
      libAliases.push(`const confetti = window.confetti;`);
    }

    customScript = `${[...new Set(libScripts)].join("\n")}
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/plain" id="__dropui-custom-src__">
${libAliases.join("\n")}
${sources.join("\n\n")}
${mounts.join("\n")}
  </script>
  <script>
    (function () {
      // Compile with the CLASSIC JSX runtime - Babel standalone's automatic
      // runtime emits "import from react/jsx-runtime" which fails as a
      // classic script without module resolution.
      function boot() {
        var src = document.getElementById("__dropui-custom-src__").textContent;
        try {
          var out = Babel.transform(src, {
            presets: [["react", { runtime: "classic" }]],
          }).code;
          var s = document.createElement("script");
          s.textContent = out;
          document.body.appendChild(s);
        } catch (err) {
          console.error("DropUI custom component failed to compile:", err);
        }
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
      } else {
        boot();
      }
    })();
  </script>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(projectName || "Project")}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body>
${body}
${customScript}
</body>
</html>`;
}

export default async function pull(projectId, opts = {}) {
  if (!projectId) {
    console.log("Usage: dropui pull <projectId>");
    return;
  }

  try {
    console.log(`Fetching project ${projectId}...`);
    const token = getToken();
    const res = await axios.get(`${API}/cli/pull/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const project = res.data.project;
    if (!project) {
      console.log("Project not found.");
      return;
    }

    const dir = opts.dir
      ? opts.dir
      : project.name
        ? project.name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase()
        : "dropui-project";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const design = project.design || project.frontend || [];

    // Save design.json
    fs.writeFileSync(path.join(dir, "design.json"), JSON.stringify(design, null, 2));

    // Generate and save index.html
    const html = generateHtml(design, project.name);
    fs.writeFileSync(path.join(dir, "index.html"), html);

    // Generate React component
    const reactCode = generateReactComponent(design);
    if (reactCode) {
      fs.writeFileSync(path.join(dir, "Component.jsx"), reactCode);
    }

    // Small README so the folder is self-explanatory
    const hasCustom = collectCustomNodes(design).length > 0;
    fs.writeFileSync(
      path.join(dir, "README.md"),      `# ${project.name}

Generated by DropUI CLI.

## Files

- \`design.json\` - raw design tree (source of truth)
- \`index.html\` - standalone page, open it directly or serve statically
${hasCustom ? "- includes admin-created custom components rendered via React + Babel runtime\n" : ""}- \`Component.jsx\` - drop-in React component (needs Tailwind CSS${
        hasCustom ? ", framer-motion, canvas-confetti" : ""
      })

## Use Component.jsx

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm i tailwindcss${hasCustom ? " framer-motion canvas-confetti" : ""}
\`\`\`

Copy \`Component.jsx\` into \`src/\`, import it in \`App.jsx\`, and include Tailwind.
`
    );

    console.log(`Project "${project.name}" pulled to ./${dir}/`);
    console.log("Files: design.json, index.html, Component.jsx, README.md");

    if (hasCustom) {
      console.log(
        `Note: includes ${collectCustomNodes(design).length} custom admin component(s).` +
          ` Component.jsx requires framer-motion and canvas-confetti.`
      );
    }
  } catch (error) {
    console.error("Pull failed:", error.response?.data?.message || error.message);
  }
}

function generateReactComponent(design) {
  // JSX text nodes need braces and angle brackets escaped
  const escapeJsxText = (str) =>
    String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\{/g, "&#123;")
      .replace(/\}/g, "&#125;");

  const customNodes = collectCustomNodes(design);
  const customMap = new Map();
  const usedLibs = new Set();

  customNodes.forEach((node, i) => {
    const prepared = prepareCustomSource(node.code, `Custom_${i + 1}`);
    if (prepared) {
      customMap.set(node, { name: `Custom_${i + 1}`, src: prepared.src });
      Object.keys(prepared.uses).forEach((k) => usedLibs.add(k));
    }
  });

  const renderJSX = (node) => {
    if (!node) return "";
    if (node.type === "root") {
      return (node.children || []).map(renderJSX).join("\n");
    }
    const p = node.props || {};
    const style = p.style || {};
    const cls = p.className || "";
    const styleStr = Object.keys(style).length ? ` style={${JSON.stringify(style)}}` : "";
    const children = (node.children || []).map(renderJSX).join("\n");

    if (node.code && customMap.has(node)) {
      return `  <${customMap.get(node).name} {...${JSON.stringify(p)}} />`;
    }

    switch (node.type) {
      case "heading": {
        const level = p.level || "h2";
        return `  <${level}${cls ? ` className="${cls}"` : ""}${styleStr}>${escapeJsxText(p.text)}</${level}>`;
      }
      case "text":
        return `  <span${cls ? ` className="${cls}"` : ""}${styleStr}>${escapeJsxText(p.text)}</span>`;
      case "paragraph":
        return `  <p${cls ? ` className="${cls}"` : ""}${styleStr}>${escapeJsxText(p.text)}</p>`;
      case "button":
        return `  <button${cls ? ` className="${cls}"` : ""}${styleStr}>${escapeJsxText(p.text || "Button")}</button>`;
      case "link":
        return `  <a href="${p.href || "#"}"${cls ? ` className="${cls}"` : ""}${styleStr}>${escapeJsxText(p.text || "Link")}</a>`;
      case "image":
        return `  <img src="${p.src || ""}" alt={${JSON.stringify(p.alt || "")}}${cls ? ` className="${cls}"` : ""}${styleStr} />`;
      case "input":
        return `  <div${styleStr}>
${p.label ? `    <label>${p.label}</label>\n` : ""}    <input type="${p.type || "text"}" placeholder="${p.placeholder || ""}" />
  </div>`;
      case "divider":
        return `  <hr${styleStr} />`;
      case "list": {
        const tag = p.ordered ? "ol" : "ul";
        const items = (p.items || []).map((item) => `    <li>${item}</li>`).join("\n");
        return `  <${tag}>\n${items}\n  </${tag}>`;
      }
      default:
        return `  <div${cls ? ` className="${cls}"` : ""}${styleStr}>
${p.text ? `    ${escapeJsxText(p.text)}\n` : ""}${children ? children + "\n" : ""}  </div>`;
    }
  };

  let content = "";
  if (Array.isArray(design)) {
    content = design.map(renderJSX).join("\n");
  } else if (design?.children) {
    content = (design.children || []).map(renderJSX).join("\n");
  } else if (design?.type) {
    content = renderJSX(design);
  }

  if (!content) return null;

  const libImports = [...usedLibs].map((k) => CUSTOM_LIB_IMPORTS[k]).join("\n");
  const customSources = [...customMap.values()].map((c) => `// inlined admin component\n${c.src}`).join("\n\n");

  return `${libImports ? libImports + "\n" : ""}import React from "react";
${customSources ? "\n" + customSources + "\n" : ""}
export default function Component() {
  return (
    <div className="min-h-screen bg-white">
${content}
    </div>
  );
}`;
}