import { parse } from "@babel/parser";

export default function extractDependencies(
  code
) {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript"
      ]
    });

    return ast.program.body
      .filter(
        (node) =>
          node.type ===
          "ImportDeclaration"
      )
      .map(
        (node) =>
          node.source.value
      )
      .filter(
        (pkg) =>
          !pkg.startsWith(".") &&
          !pkg.startsWith("/")
      );
  } catch {
    return [];
  }
}