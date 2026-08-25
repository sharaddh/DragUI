import { componentLabels } from "../store/useBuilderStore";

// Single source of truth for the overrides a registry component carries
// into the tree - used by both canvas drop and sidebar click-to-add so
// the two paths can never drift apart.
export function buildComponentOverrides(data = {}, type = "") {
  return {
    props: data.props || {},
    code: data.code || data.template || "",
    template: data.template || "",
    thumbnail: data.thumbnail || "",
    label: data.label || componentLabels[type] || type,
  };
}
