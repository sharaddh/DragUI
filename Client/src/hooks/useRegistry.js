import { useEffect, useState } from "react";
import { getComponents } from "../api/component";
import { registry as localRegistry } from "../utils/registry";
import { components as availableComponents } from "../DropUi/index";

export function useRegistry() {
  const [registry, setRegistry] = useState(localRegistry);

  useEffect(() => {
    getComponents()
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((comp) => ({
            type: comp.name,
            label: comp.label,
            defaultProps: comp.props?.reduce((acc, prop) => {
              acc[prop.name] = prop.default || "";
              return acc;
            }, {}) || {},
            propsSchema: comp.props?.reduce((acc, prop) => {
              acc[prop.name] = { type: prop.type, label: prop.label };
              return acc;
            }, {}) || {},
          }));

          setRegistry(mapped);
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