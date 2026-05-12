import { useEffect, useState } from "react";
import { getComponents } from "../api/component";
import { registry as localRegistry } from "../utils/registry";

export function useRegistry() {
  const [registry, setRegistry] = useState(localRegistry);

  useEffect(() => {
    getComponents()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(comp => ({
            type: comp.name,
            label: comp.label,
            defaultProps: comp.props.reduce((acc, prop) => {
              acc[prop.name] = prop.default || "";
              return acc;
            }, {}),
            propsSchema: comp.props.reduce((acc, prop) => {
              acc[prop.name] = { type: prop.type, label: prop.label };
              return acc;
            }, {}),
          }));
          setRegistry(mapped);
        }
      })
      .catch(() => {
        setRegistry(localRegistry);
      });
  }, []);

  return registry;
}