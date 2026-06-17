import { useEffect, useState } from "react";

export default function PreviewPanel({ code }) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // Wait 500ms after the user stops typing before compiling
    const timeout = setTimeout(() => {
      
      // 1. Find the name of the component (e.g., "Button" from "export default function Button")
      const match = code.match(/export default function\s+(\w+)/);
      const componentName = match ? match[1] : "Component";

      // 2. Strip "export default" so the function can run cleanly in the script tag
      const cleanCode = code.replace(/export default/, "");

      // 3. Build an HTML document that loads React, Babel, and mounts the component
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 2rem; 
                font-family: system-ui, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                box-sizing: border-box;
              }
            </style>
            <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin><\/script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin><\/script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
          </head>
          <body>
            <div id="root"></div>
            
            <script type="text/babel">
              // Inject the user's React code
              ${cleanCode}
              
              // Tell ReactDOM to render it
              try {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<${componentName} />);
              } catch (err) {
                document.getElementById('root').innerHTML = '<div style="color:red;font-family:monospace;">' + err.message + '</div>';
              }
            <\/script>
          </body>
        </html>
      `;
      
      setSrcDoc(html);
    }, 500);

    // Cleanup the timeout if the user keeps typing
    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        title="preview"
        className="w-full h-full border-none"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}