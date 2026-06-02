import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export default function extractProps(code) {
  const props = [];

  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript"
      ]
    });

    traverse.default(ast, {
      FunctionDeclaration(path) {
        const first =
          path.node.params?.[0];

        if (
          first &&
          first.type === "ObjectPattern"
        ) {
          first.properties.forEach(
            (prop) => {
              props.push({
                name:
                  prop.key.name,

                label:
                  prop.key.name,

                type: "text",

                required: false
              });
            }
          );
        }
      },

      ArrowFunctionExpression(
        path
      ) {
        const first =
          path.node.params?.[0];

        if (
          first &&
          first.type === "ObjectPattern"
        ) {
          first.properties.forEach(
            (prop) => {
              props.push({
                name:
                  prop.key.name,

                label:
                  prop.key.name,

                type: "text",

                required: false
              });
            }
          );
        }
      }
    });

    return props;
  } catch {
    return [];
  }
}