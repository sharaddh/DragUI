import { useEffect, useState } from "react";

export default function PreviewPanel({ code }) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // 600ms debounce so we don't compile on every single keystroke
    const timeout = setTimeout(() => {
      
      // Escape backticks and dollar signs so they don't break the HTML string injection
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
               <div style="color: #aaa; font-family: sans-serif; font-size: 14px;">Rendering...</div>
            </div>
            
            <script>
              // Wait a tiny bit to ensure React/Babel scripts are fully loaded
              setTimeout(() => {
                try {
                  const rawCode = \`${escapedCode}\`;
                  
                  // 1. Strip import statements (Browsers crash on bare imports)
                  let cleanCode = rawCode.replace(/import\\s+.*?from\\s+['"].*?['"];?/g, '// import stripped\\n');
                  
                  // 2. Remove 'export default' so we can evaluate the function locally
                  cleanCode = cleanCode.replace(/export\\s+default\\s+/, '');
                  
                  // 3. Find the component name (e.g., 'Button' or 'Component')
                  const match = cleanCode.match(/(?:function|const|class)\\s+(\\w+)/);
                  const componentName = match ? match[1] : null;

                  if (!componentName) {
                    throw new Error("Could not detect a component name. Ensure you use 'function YourComponentName()'");
                  }

                  // 4. Append the React 18 mount logic
                  const codeToCompile = cleanCode + '\\n\\nconst root = ReactDOM.createRoot(document.getElementById("root"));\\nroot.render(React.createElement(' + componentName + '));';

                  // 5. Transpile JSX into plain JavaScript using Babel programmatically
                  const compiled = Babel.transform(codeToCompile, { presets: ['react'] }).code;
                  
                  // 6. Execute the compiled code!
                  eval(compiled);
                  
                } catch (err) {
                  // If there is an error (like a missing closing tag), show it on screen!
                  document.getElementById('root').innerHTML = '<div style="color: #dc2626; font-family: monospace; padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; max-width: 90%; white-space: pre-wrap;"><strong>Build Error:</strong><br/>' + err.toString() + '</div>';
                }
              }, 50);
            </script>
          </body>
        </html>
      `;
      
      setSrcDoc(html);
    }, 600);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        title="preview"
        className="w-full h-full border-none bg-white"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}