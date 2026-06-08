import Editor from "@monaco-editor/react";

export default function MonacoEditor({
  code,
  setCode,
}) {

  return (

    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={code}
      onChange={(value) =>
        setCode(value)
      }
      options={{
        fontSize: 14,
        minimap: {
          enabled: true,
        },
        automaticLayout: true,
        wordWrap: "on",
      }}
    />

  );

}