import { useEffect, useState } from "react";
import { getComponents } from "../api/component";
import { registry as localRegistry } from "../utils/registry";

export function useRegistry() {
  const [registry, setRegistry] = useState(localRegistry);

  useEffect(() => {
    getComponents()
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((comp) => ({
            type: comp.name,
            label: comp.label || comp.name,
            template: comp.template || "",
            code: comp.code || "",
            thumbnail: comp.thumbnail || "",
            defaultProps: comp.props?.reduce((acc, prop) => {
              acc[prop.name] = prop.defaultValue || "";
              return acc;
            }, {}) || {},
            propsSchema: comp.props?.reduce((acc, prop) => {
              acc[prop.name] = { type: prop.type, label: prop.label };
              return acc;
            }, {}) || {},
          }));

          setRegistry([...localRegistry, ...mapped]);
          return;
        }

        setRegistry(localRegistry);
      })
      .catch(() => {
        setRegistry(localRegistry);
      });
  }, []);

  return registry;
}