import RuntimeComponent from "./RuntimeComponent";

export default function ComponentPreview({ comp }) {
  const code = comp?.code || comp?.template || "";
  const thumbnail = comp?.thumbnail;

  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt={comp?.label || "preview"}
        draggable={false}
        className="h-full w-full object-cover"
      />
    );
  }

  if (code) {
    return <RuntimeComponent code={code} props={comp?.defaultProps || {}} />;
  }

  const previewProps = Object.entries(comp?.defaultProps || {}).filter(
    ([key, value]) => value !== "" && value != null && key !== "style"
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center">
      <div className="text-xs font-semibold text-slate-700">{comp?.label || "Component"}</div>
      {previewProps.length > 0 ? (
        <div className="space-y-0.5 text-[10px] font-mono text-slate-400">
          {previewProps.slice(0, 3).map(([key, value]) => (
            <div key={key} className="truncate">
              <span className="text-slate-500">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[10px] italic text-slate-400">No configuration properties</div>
      )}
    </div>
  );
}
