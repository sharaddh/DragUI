import { useEffect, useState } from "react";
import { getComponents } from "../api/component";
import { registry as localRegistry } from "../utils/registry";

export function useRegistry() {
  const [registry, setRegistry] = useState(localRegistry);

  useEffect(() => {
    getComponents()
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.reduce((acc, comp) => {
            if (!comp || !comp.name) return acc;
            const props = Array.isArray(comp.props) ? comp.props : [];
            acc.push({
              type: comp.name,
              label: comp.label || comp.name,
              template: comp.template || "",
              code: comp.code || "",
              thumbnail: comp.thumbnail || "",
              defaultProps: props.reduce((p, prop) => {
                if (prop && prop.name) p[prop.name] = prop.defaultValue ?? "";
                return p;
              }, {}),
              propsSchema: props.reduce((p, prop) => {
                if (prop && prop.name) p[prop.name] = { type: prop.type, label: prop.label };
                return p;
              }, {}),
            });
            return acc;
          }, []);

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