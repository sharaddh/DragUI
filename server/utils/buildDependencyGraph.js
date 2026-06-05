export default function buildDependencyGraph(
  components = []
) {

  const graph = {};

  components.forEach(
    (component) => {

      const deps =
        component.dependencies || [];

      deps.forEach((dep) => {

        if (!graph[dep]) {
          graph[dep] = [];
        }

        graph[dep].push({
          id: component._id,

          name:
            component.name,

          version:
            component.version,
        });

      });

    }
  );

  return graph;
}