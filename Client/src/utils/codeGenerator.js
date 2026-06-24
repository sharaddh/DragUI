function styleToCSS(style) {
  if (!style || !Object.keys(style).length) return "";
  return Object.entries(style)
    .map(([key, val]) => {
      if (!val && val !== 0) return null;
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  ${cssKey}: ${val};`;
    })
    .filter(Boolean)
    .join("\n");
}

function renderHTMLNode(node, depth = 0, projectName) {
  if (!node || node.type === "root") {
    return (node?.children || []).map((c) => renderHTMLNode(c, depth, projectName)).join("\n");
  }

  const p = node.props || {};
  const style = p.style || {};
  const css = styleToCSS(style);
  const cls = p.className || "";
  const indent = "  ".repeat(depth + 1);
  const children = (node.children || []).map((c) => renderHTMLNode(c, depth + 1, projectName)).join("\n");

  switch (node.type) {
    case "heading": {
      const level = p.level || "h2";
      return `${indent}<${level}${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>${escapeHtml(p.text || "")}</${level}>`;
    }
    case "text":
      return `${indent}<span${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>${escapeHtml(p.text || "")}</span>`;
    case "paragraph":
      return `${indent}<p${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>${escapeHtml(p.text || "")}</p>`;
    case "button":
      return `${indent}<button${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>${escapeHtml(p.text || "Button")}</button>`;
    case "link":
      return `${indent}<a href="${escapeHtml(p.href || "#")}"${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>${escapeHtml(p.text || "Link")}</a>`;
    case "image":
      return `${indent}<img src="${escapeHtml(p.src || "")}" alt="${escapeHtml(p.alt || "")}"${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""} />`;
    case "input": {
      const label = p.label ? `${indent}  <label>${escapeHtml(p.label)}</label>\n` : "";
      return `${indent}<div>\n${label}${indent}  <input type="${p.type || "text"}" placeholder="${escapeHtml(p.placeholder || "")}" />\n${indent}</div>`;
    }
    case "divider":
      return `${indent}<hr${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""} />`;
    case "list": {
      const tag = p.ordered ? "ol" : "ul";
      const items = (p.items || []).map((item) => `${indent}  <li>${escapeHtml(item)}</li>`).join("\n");
      return `${indent}<${tag}${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>\n${items}\n${indent}</${tag}>`;
    }
    case "video":
      return `${indent}<div>\n${indent}  <iframe src="${escapeHtml(p.src || "")}" style="width:100%;height:100%;min-height:200px;border:none" allowFullScreen></iframe>\n${indent}</div>`;
    default:
      return `${indent}<div${cls ? ` class="${cls}"` : ""}${css ? ` style="${css.replace(/\n/g, " ").trim()}"` : ""}>\n${p.text ? `${indent}  ${escapeHtml(p.text)}\n` : ""}${children ? children + "\n" : ""}${indent}</div>`;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateHTML(tree, projectName = "Project") {
  const bodyContent = renderHTMLNode(tree, 0, projectName);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(projectName)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

export function generateReactJSX(tree) {
  const renderNode = (node, depth = 0) => {
    if (!node || node.type === "root") {
      return (node?.children || []).map((c) => renderNode(c, depth)).join("\n");
    }
    const p = node.props || {};
    const style = p.style || {};
    const cls = p.className || "";
    const indent = "  ".repeat(depth + 1);
    const children = (node.children || []).map((c) => renderNode(c, depth + 1)).join("\n");

    const styleStr = Object.keys(style).length ? ` style={${JSON.stringify(style)}}` : "";

    switch (node.type) {
      case "heading": {
        const level = p.level || "h2";
        return `${indent}<${level}${cls ? ` className="${cls}"` : ""}${styleStr}>{${JSON.stringify(p.text || "")}}</${level}>`;
      }
      case "text":
        return `${indent}<span${cls ? ` className="${cls}"` : ""}${styleStr}>{${JSON.stringify(p.text || "")}}</span>`;
      case "paragraph":
        return `${indent}<p${cls ? ` className="${cls}"` : ""}${styleStr}>{${JSON.stringify(p.text || "")}}</p>`;
      case "button":
        return `${indent}<button${cls ? ` className="${cls}"` : ""}${styleStr}>{${JSON.stringify(p.text || "Button")}}</button>`;
      case "link":
        return `${indent}<a href="${p.href || "#"}"${cls ? ` className="${cls}"` : ""}${styleStr}>{${JSON.stringify(p.text || "Link")}}</a>`;
      case "image":
        return `${indent}<img src="${p.src || ""}" alt="${p.alt || ""}"${cls ? ` className="${cls}"` : ""}${styleStr} />`;
      case "input":
        return `${indent}<div${cls ? ` className="${cls}"` : ""}${styleStr}>
${p.label ? `${indent}  <label>${p.label}</label>\n` : ""}${indent}  <input type="${p.type || "text"}" placeholder="${p.placeholder || ""}" />
${indent}</div>`;
      case "divider":
        return `${indent}<hr${cls ? ` className="${cls}"` : ""}${styleStr} />`;
      case "list": {
        const tag = p.ordered ? "ol" : "ul";
        const items = (p.items || []).map((item) => `${indent}  <li>${item}</li>`).join("\n");
        return `${indent}<${tag}${cls ? ` className="${cls}"` : ""}${styleStr}>\n${items}\n${indent}</${tag}>`;
      }
      default:
        return `${indent}<div${cls ? ` className="${cls}"` : ""}${styleStr}>\n${p.text ? `${indent}  ${p.text}\n` : ""}${children ? children + "\n" : ""}${indent}</div>`;
    }
  };

  const content = renderNode(tree);
  return `import React from "react";

export default function Component() {
  return (
${content}
  );
}`;
}

export function generatePackageJson(projectName = "dropui-project") {
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, "-"),
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.0.0",
      vite: "^6.0.0",
    },
  }, null, 2);
}