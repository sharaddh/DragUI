import { useEffect, useState, useRef } from "react";
import { Moon, Sun } from "lucide-react";

export default function PreviewPanel({ code }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [renderKey, setRenderKey] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const iframeRef = useRef(null);

  // 1. Send an instant message to the iframe when the theme changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "SET_THEME", isDark }, "*");
    }
  }, [isDark]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      const html = `
        <!DOCTYPE html>
        <html class="${isDark ? 'dark' : ''}">
          <head>
            <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
              tailwind.config = {
                darkMode: 'class',
              }
            </script>

            <style>
              /* Base styling that reacts to the dark class automatically */
              html, body { margin: 0; min-height: 100vh; }
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                transition: background-color 0.3s ease, color 0.3s ease;
                background-color: #ffffff;
                color: #000000;
              }
              html.dark body {
                background-color: #09090b; /* zinc-950 */
                color: #ffffff;
              }
              #root { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding: 2rem; box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root">
               <div style="color: #aaa; font-family: sans-serif; font-size: 14px;">Compiling...</div>
            </div>
            
            <script>
              // Listen for the theme toggle from the parent window
              window.addEventListener('message', (event) => {
                if (event.data.type === 'SET_THEME') {
                  if (event.data.isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              });

              setTimeout(() => {
                try {
                  const rawCode = \`${escapedCode}\`;
                  
                  let cleanCode = rawCode.replace(/import\\s+[\\s\\S]*?from\\s+['"].*?['"];?/g, '');
                  cleanCode = cleanCode.replace(/import\\s+['"].*?['"];?/g, '');
                  cleanCode = cleanCode.replace(/export\\s+default\\s+/g, '');
                  cleanCode = cleanCode.replace(/export\\s+/g, '');
                  
                  const match = cleanCode.match(/(?:function|const|let|var|class)\\s+(\\w+)/);
                  const componentName = match ? match[1] : null;

                  if (!componentName) {
                    throw new Error("Could not find a valid React component name.");
                  }

                  const codeToCompile = cleanCode + '\\n\\nconst root = ReactDOM.createRoot(document.getElementById("root"));\\nroot.render(React.createElement(' + componentName + '));';

                  const compiled = Babel.transform(codeToCompile, { 
                    presets: [['react', { runtime: 'classic' }]] 
                  }).code;
                  
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
      setRenderKey(prev => prev + 1);
    }, 600);

    return () => clearTimeout(timeout);
  }, [code]); // Notice we DO NOT include isDark in this dependency array! We don't want to rebuild on theme switch.

  return (
    <div className="w-full h-full relative group bg-black">
      
      {/* Floating Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-gray-300/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-black shadow-lg transition-all active:scale-95"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      <iframe
        ref={iframeRef}
        key={renderKey}
        title="preview"
        className="w-full h-full border-none transition-colors duration-300"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}