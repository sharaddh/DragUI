import { useEffect, useState } from "react";

export default function PreviewPanel({ code }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Escape backticks and dollars to prevent string interpolation crashes
      const escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      const html = `
        