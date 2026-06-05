export default function healthScanner(
  component
) {

  const issues = [];

  if (
    !component.description
  ) {
    issues.push(
      "Missing description"
    );
  }

  if (
    !component.thumbnail
  ) {
    issues.push(
      "Missing thumbnail"
    );
  }

  if (
    !component.props?.length
  ) {
    issues.push(
      "No props detected"
    );
  }

  if (
    !component.dependencies?.length
  ) {
    issues.push(
      "No dependencies detected"
    );
  }

  return {
    healthy:
      issues.length === 0,

    issues,
  };
}