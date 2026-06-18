import { useEffect, useState, useRef } from "react";
import { Moon, Sun } from "lucide-react";

export default function PreviewPanel({ code, assets = [] }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [renderKey, setRenderKey] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "SET_THEME", isDark }, "*");
    }
  }, [isDark]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      if (assets && assets.length > 0) {
        assets.forEach((asset) => {
          const assetRegex = new RegExp(`['"\`][./]*${asset.name}['"\`]`, 'g');
          escapedCode = escapedCode.replace(assetRegex, `"${asset.url}"`);
        });
      }

      const html = `
        <!DOCTYPE html>
        <html class="${isDark ? 'dark' : ''}">
          <head>
            <script type="importmap">
              {
                "imports": {
                  "react": "https://esm.sh/react@18.2.0",
                  "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
                  "react-dom": "https://esm.sh/react-dom@18.2.0",
                  "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime" 
                }
              }
            </script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>tailwind.config = { darkMode: 'class' }</script>
            <style>
              html, body { margin: 0; min-height: 100vh; }
              body { display: flex; justify-content: center; align-items: center; background-color: #ffffff; color: #000000; }
              html.dark body { background-color: #09090b; color: #ffffff; }
              #root { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding: 2rem; box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root">
               <div style="color: #aaa; font-family: sans-serif; font-size: 14px;">Compiling...</div>
            </div>
            
            <script type="module">
              window.addEventListener('message', (event) => {
                if (event.data.type === 'SET_THEME') {
                  event.data.isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
                }
              });

              setTimeout(async () => {
                try {
                  const rawCode = \`${escapedCode}\`;
                  let cleanCode = rawCode;
                  
                  // 1. REWRITE NPM IMPORTS
                  cleanCode = cleanCode.replace(/import\\s+([\\s\\S]*?)\\s+from\\s+['"]([^.\\/][^'"]+)['"];?/g, function(match, imports, packageName) {
                    // Leave react imports alone so the Import Map handles them!
                    if (packageName === 'react' || packageName === 'react-dom' || packageName === 'react-dom/client') {
                      return match; 
                    }
                    return 'import ' + imports + ' from "https://esm.sh/' + packageName + '?external=react,react-dom";';
                  });

                  // 2. STRIP EXPORTS
                  cleanCode = cleanCode.replace(/export\\s+default\\s+/g, '');
                  cleanCode = cleanCode.replace(/export\\s+/g, '');
                  
                  const match = cleanCode.match(/(?:function|const|let|var|class)\\s+(\\w+)/);
                  const componentName = match ? match[1] : null;

                  if (!componentName) throw new Error("Could not find a valid React component name.");

                  // 3. INJECT REACT GLOBALLY (To prevent 'React is not defined' Babel errors)
                  const codeToCompile = \`
                    import * as __React__ from "react";
                    import { createRoot as __createRoot__ } from "react-dom/client";
                    window.React = __React__; 
                    
                    \${cleanCode}
                    
                    const __root__ = __createRoot__(document.getElementById("root"));
                    __root__.render(__React__.createElement(\${componentName}));
                  \`;

                  // 4. COMPILE JSX
                  const compiled = Babel.transform(codeToCompile, { presets: [['react', { runtime: 'classic' }]] }).code;
                  
                  // 5. EXECUTE BLOB
                  const blob = new Blob([compiled], { type: 'application/javascript' });
                  const url = URL.createObjectURL(blob);
                  await import(url);
                  
                } catch (err) {
                  document.getElementById('root').innerHTML = '<div style="color: #dc2626; padding: 20px;"><strong>Build Error:</strong><br/>' + err.toString() + '</div>';
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
  }, [code, assets]);

  return (
    <div className="w-full h-full relative group bg-black">
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-lg transition-all"
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
      <iframe ref={iframeRef} key={renderKey} className="w-full h-full border-none transition-colors duration-300" srcDoc={srcDoc} sandbox="allow-scripts allow-same-origin" />
    </div>
  );
}