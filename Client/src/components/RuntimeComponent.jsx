import { useMemo } from "react";
import { LiveProvider, LivePreview } from "react-live";

function prepareCode(code = "") {
  let src = code
    .replace(/import\s+React\s*,\s*\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+React\s+from\s*['"]react['"];?/g, "")
    .replace(/^\s*import[^\n]*$/gm, "");

  const ref = "__DropUiPreview__";

  const fnMatch = src.match(/export\s+default\s+function\s+(\w+)/);
  const varMatch = src.match(/export\s+default\s+(const|let|var)\s+(\w+)/);
  const arrowMatch = src.match(/export\s+default\s+((?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>)/);
  const bareMatch = src.match(/export\s+default\s+([\w$]+)\s*;?/);

  if (fnMatch) {
    src = src.replace(`export default function ${fnMatch[1]}`, `function ${ref}`);
  } else if (varMatch) {
    src = src.replace(`export default ${varMatch[1]} ${varMatch[2]}`, `${varMatch[1]} ${ref}`);
  } else if (arrowMatch) {
    src = src.replace(/export\s+default\s+/, `const ${ref} = `);
  } else if (bareMatch) {
    src = src.replace(bareMatch[0], "");
    src += `\nconst ${ref} = ${bareMatch[1]};`;
  } else {
    return { code: "", ref: "" };
  }

  return { code: src, ref };
}

export default function RuntimeComponent({ code, props }) {
  const liveCode = useMemo(() => {
    if (!code) return "";
    const { code: clean, ref } = prepareCode(code);
    if (!ref) return "";
    return `${clean}\nrender(<${ref} {...__props__} />);`;
  }, [code]);

  const scope = useMemo(() => ({ __props__: props || {} }), [props]);

  if (!liveCode) return null;

  return (
    <LiveProvider code={liveCode} scope={scope} noInline>
      <LivePreview className="h-full w-full" />
    </LiveProvider>
  );
}
