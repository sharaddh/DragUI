import fs from "fs";
import path from "path";
import axios from "axios";
import { getToken } from "../utils/auth.js";

const API = "http://localhost:5000/api";

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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

function renderNode(node) {
  if (!node) return "";
  if (node.type === "root") {
    return (node.children || []).map(renderNode).join("\n");
  }

  const p = node.props || {};
  const style = p.style || {};
  const inline = styleToInline(style);
  const cls = p.className || "";
  const attrs = ` class="${cls}"${inline ? ` style="${inline}"` : ""}`;
  const children = (node.children || []).map(renderNode).join("\n");

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
  let body = "";
  if (Array.isArray(design)) {
    body = design.map(renderNode).join("\n");
  } else if (design?.children) {
    body = (design.children || []).map(renderNode).join("\n");
  } else if (design?.type) {
    body = renderNode(design);
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
</body>
</html>`;
}

export default async function pull(projectId) {
  if (!projectId) {
    console.log("Usage: dropui pull <projectId>");
    return;
  }

  try {
    console.log(`Fetching project ${projectId}...`);
    const res = await axios.get(`${API}/cli/pull/${projectId}`);

    const project = res.data.project;
    if (!project) {
      console.log("Project not found.");
      return;
    }

    const dir = project.name ? project.name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() : "dropui-project";

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

    console.log(`Project "${project.name}" pulled to ./${dir}/`);
    console.log("Files: design.json, index.html, Component.jsx");
  } catch (error) {
    console.error("Pull failed:", error.response?.data?.message || error.message);
  }
}

function generateReactComponent(design) {
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

    switch (node.type) {
      case "heading": {
        const level = p.level || "h2";
        return `  <${level}${cls ? ` className="${cls}"` : ""}${styleStr}>${p.text || ""}</${level}>`;
      }
      case "text":
        return `  <span${cls ? ` className="${cls}"` : ""}${styleStr}>${p.text || ""}</span>`;
      case "paragraph":
        return `  <p${cls ? ` className="${cls}"` : ""}${styleStr}>${p.text || ""}</p>`;
      case "button":
        return `  <button${cls ? ` className="${cls}"` : ""}${styleStr}>${p.text || "Button"}</button>`;
      case "link":
        return `  <a href="${p.href || "#"}"${cls ? ` className="${cls}"` : ""}${styleStr}>${p.text || "Link"}</a>`;
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
${p.text ? `    ${p.text}\n` : ""}${children ? children + "\n" : ""}  </div>`;
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

  return `import React from "react";

export default function Component() {
  return (
    <div className="min-h-screen bg-white">
${content}
    </div>
  );
}`;
}