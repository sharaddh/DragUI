import Editor from "@monaco-editor/react";

export default function MonacoEditor({ code, setCode }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark" // Standard dark theme, fits perfectly into our layout
      value={code}
      onChange={(value) => setCode(value)}
      options={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 14,
        minimap: { enabled: false }, // Turned off for a cleaner UI in limited space
        automaticLayout: true,
        wordWrap: "on",
        padding: { top: 16 },
        scrollBeyondLastLine: false,
      }}
    />
  );
}