export default function PreviewPanel({ code }) {
  return (
    <div className="w-full h-full bg-[#111111]"> 
      {/* Note: The iframe background is intentionally kept close to white/light 
        if your components are meant to be viewed in a standard DOM, 
        or you can enforce a dark background inside the srcDoc style tag below.
      */}
      <iframe
        title="preview"
        className="w-full h-full border-none bg-gry-900"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; display: flex; justify-content: center; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script>${code}</script>
            </body>
          </html>
        `}
      />
    </div>
  );
}