import fs from "fs-extra";
import path from "path";
import { chromium } from "playwright";
import cloudinary from "../config/cloudinary.js";

// 🌟 UPGRADED TEMPLATE: Matches your frontend PreviewPanel exactly!
const TEMPLATE = (code, assets = []) => {
  let escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  // Inject asset URLs if there are images
  if (assets && assets.length > 0) {
    assets.forEach((asset) => {
      const assetRegex = new RegExp(`['"\`][./]*${asset.name}['"\`]`, 'g');
      escapedCode = escapedCode.replace(assetRegex, `"${asset.url}"`);
    });
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  
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

  <style>
    body { margin:0; padding:0; width:1200px; height:630px; display:flex; justify-content:center; align-items:center; background:#0f172a; }
    #root { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
  </style>
</head>
<body>
  <div id="root">
    <div style="color: #aaa; font-family: sans-serif;">Compiling Thumbnail...</div>
  </div>

  <script type="module">
    setTimeout(async () => {
      try {
        const rawCode = \`${escapedCode}\`;
        let cleanCode = rawCode;
        
        // 1. Rewrite NPM Imports
        cleanCode = cleanCode.replace(/import\\s+([\\s\\S]*?)\\s+from\\s+['"]([^.\\/][^'"]+)['"];?/g, function(match, imports, packageName) {
          if (packageName === 'react' || packageName === 'react-dom' || packageName === 'react-dom/client') return match;
          return 'import ' + imports + ' from "https://esm.sh/' + packageName + '?external=react,react-dom";';
        });

        // 2. Strip Exports
        cleanCode = cleanCode.replace(/export\\s+default\\s+/g, '');
        cleanCode = cleanCode.replace(/export\\s+/g, '');
        
        // 3. Find Component Name (Fixes the "App" bug!)
        const match = cleanCode.match(/(?:function|const|let|var|class)\\s+(\\w+)/);
        const componentName = match ? match[1] : null;

        if (!componentName) throw new Error("No component name found");

        const codeToCompile = \`
          import * as __React__ from "react";
          import { createRoot as __createRoot__ } from "react-dom/client";
          window.React = __React__; 
          
          \${cleanCode}
          
          const __root__ = __createRoot__(document.getElementById("root"));
          __root__.render(__React__.createElement(\${componentName}));
          
          // 🟢 CRITICAL: Tell Playwright we are done rendering!
          window.__RENDER_COMPLETE__ = true;
        \`;

        const compiled = Babel.transform(codeToCompile, { presets: [['react', { runtime: 'classic' }]] }).code;
        const blob = new Blob([compiled], { type: 'application/javascript' });
        await import(URL.createObjectURL(blob));
        
      } catch (err) {
        console.error(err);
        document.getElementById('root').innerHTML = '<div style="color: red;">Build Error</div>';
        window.__RENDER_COMPLETE__ = true; // Unblock Playwright even on error
      }
    }, 50);
  </script>
</body>
</html>
`;
};

export const renderThumbnail = async (component) => {
  try {
    const tempDir = path.join(process.cwd(), "temp");
    const thumbDir = path.join(process.cwd(), "thumbnails");

    await fs.ensureDir(tempDir);
    await fs.ensureDir(thumbDir);

    const htmlPath = path.join(tempDir, `${component.slug}.html`);
    const imagePath = path.join(thumbDir, `${component.slug}.png`);

    // Pass the code AND assets to the template
    await fs.writeFile(htmlPath, TEMPLATE(component.code, component.assets || []));

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 }
    });

    // Capture console logs from inside the Playwright browser to your Node terminal
    page.on('console', msg => console.log(`[Playwright Console]: ${msg.text()}`));

    await page.goto(`file://${htmlPath}`);

    // 🌟 WAIT FOR RENDER TO FINISH! 🌟
    // Prevents taking a screenshot of the "Compiling Thumbnail..." text
    await page.waitForFunction('window.__RENDER_COMPLETE__ === true', { timeout: 10000 });
    
    // Give animations (like Framer Motion) a tiny half-second to settle into place
    await page.waitForTimeout(500);

    await page.screenshot({ path: imagePath });
    await browser.close();

    const uploaded = await cloudinary.uploader.upload(imagePath, {
      folder: "dropui-thumbnails"
    });

    // Cleanup local files
    await fs.remove(htmlPath);
    await fs.remove(imagePath);

    return {
      url: uploaded.secure_url,
      publicId: uploaded.public_id
    };

  } catch (error) {
    console.error("🔥 RENDER THUMBNAIL CRASH:", error);
    return null;
  }
};