import { useEffect, useState } from "react";

export default function PreviewPanel({ code }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Escape backticks and dollars to prevent string interpolation crashes
      const escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #ffffff; }
              #root { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding: 2rem; box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root">
               <div style="color: #aaa; font-family: sans-serif; font-size: 14px;">Compiling...</div>
            </div>
            
            <script>
              setTimeout(() => {
                try {
                  const rawCode = \`${escapedCode}\`;
                  
                  // 1. Aggressively strip all user-defined imports
                  let cleanCode = rawCode.replace(/import\\s+[\\s\\S]*?from\\s+['"].*?['"];?/g, '');
                  cleanCode = cleanCode.replace(/import\\s+['"].*?['"];?/g, '');
                  
                  // 2. Strip all 'export default' and 'export' keywords
                  cleanCode = cleanCode.replace(/export\\s+default\\s+/g, '');
                  cleanCode = cleanCode.replace(/export\\s+/g, '');
                  
                  // 3. Find the component name (e.g., function App() -> App)
                  const match = cleanCode.match(/(?:function|const|let|var|class)\\s+(\\w+)/);
                  const componentName = match ? match[1] : null;

                  if (!componentName) {
                    throw new Error("Could not find a valid React component name.");
                  }

                  // 4. Create the final execution script
                  const codeToCompile = cleanCode + '\\n\\nconst root = ReactDOM.createRoot(document.getElementById("root"));\\nroot.render(React.createElement(' + componentName + '));';

                  // 5. TRANSLATE TO ES5 (Forcing the 'classic' runtime to prevent hidden imports)
                  const compiled = Babel.transform(codeToCompile, { 
                    presets: [
                      ['react', { runtime: 'classic' }] // <-- This prevents the hidden JSX import crash!
                    ] 
                  }).code;
                  
                  // 6. Execute!
                  eval(compiled);
                  
                } catch (err) {
                  document.getElementById('root').innerHTML = '<div style="color: #dc2626; font-family: monospace; padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; max-width: 90%; white-space: pre-wrap;"><strong>Build Error:</strong><br/>' + err.toString() + '</div>';
                }
              }, 30);
            </script>
          </body>
        </html>
      `;
      
      setSrcDoc(html);
      setRenderKey(prev => prev + 1); // Hard reset the iframe to clear previous crashes
    }, 600);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        key={renderKey}
        title="preview"
        className="w-full h-full border-none bg-white"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}