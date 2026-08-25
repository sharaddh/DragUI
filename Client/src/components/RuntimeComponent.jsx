import { useMemo } from "react";
import * as React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import LiveErrorBoundary from "./LiveErrorBoundary";

function prepareCode(code = "") {
  let src = code
    .replace(/import\s+React\s*,\s*\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+\{([^}]*)\}\s+from\s*['"]react['"];?/g, "const { $1 } = React;")
    .replace(/import\s+React\s+from\s*['"]react['"];?/g, "")
    .replace(/^\s*import[^\n]*$/gm, "");

  // Named exports become plain declarations so they stay usable in-scope
  src = src.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ");

  const ref = "__DropUiPreview__";

  const fnMatch = src.match(/(?:^|\n)\s*export\s+default\s+function\s+(\w+)/);
  const varMatch = src.match(/export\s+default\s+(?:const|let|var)\s+(\w+)/);
  const arrowMatch = src.match(/export\s+default\s+(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/);
  const bareMatch = src.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;?\s*(?:\n|$)/);

  if (fnMatch) {
    src = src.replace(/export\s+default\s+function\s+(\w+)/, `function ${ref}`);
  } else if (varMatch) {
    src = src.replace(/export\s+default\s+(const|let|var)\s+(\w+)/, `$1 ${ref}`);
  } else if (arrowMatch) {
    src = src.replace(/export\s+default\s+/, `const ${ref} = `);
  } else if (bareMatch) {
    src += `\nconst ${ref} = ${bareMatch[1]};`;
  } else {
    return { code: "", ref: "" };
  }

  return { code: src, ref };
}

// Libraries admin-created components may import - import lines are stripped,
// so every identifier they reference must exist in the live scope.
export const RUNTIME_SCOPE_LIBS = { motion, AnimatePresence, confetti };

export default function RuntimeComponent({ code, props }) {
  const liveCode = useMemo(() => {
    if (!code) return "";
    const { code: clean, ref } = prepareCode(code);
    if (!ref) return "";
    return `${clean}\nrender(<${ref} {...__props__} />);`;
  }, [code]);

  // Keyed by serialized props so a new object identity with the same
  // values does not recompile the live sandbox on every render.
  const propsKey = JSON.stringify(props || {});

  const scope = useMemo(
    () => ({
      __props__: JSON.parse(propsKey),
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useRef: React.useRef,
      useMemo: React.useMemo,
      useCallback: React.useCallback,
      useContext: React.useContext,
      useReducer: React.useReducer,
      useLayoutEffect: React.useLayoutEffect,
      ...RUNTIME_SCOPE_LIBS,
    }),
    [propsKey]
  );

  if (!liveCode) return null;

  return (
    <LiveProvider code={liveCode} scope={scope} noInline>
      <LiveError className="rounded-lg border border-red-200 bg-red-50 p-2 text-left text-[10px] leading-snug text-red-600" />
      <LiveErrorBoundary>
        <LivePreview className="h-full w-full" />
      </LiveErrorBoundary>
    </LiveProvider>
  );
}
