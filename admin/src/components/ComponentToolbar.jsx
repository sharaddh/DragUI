import {
  Save,
  Upload,
  Rocket,
} from "lucide-react";
export default function ComponentToolbar({

  onSave,
  onVersion,
  onLock,
  isLocked

}) {

  return (

    <div
      className="
      h-14
      border-b
      flex
      items-center
      px-4
      gap-4
      "
    >

      <button
        onClick={onSave}
        className="
        flex
        gap-2
        "
      >
        <Save size={18} />
        Save
      </button>

      <button
        onClick={onVersion}
        className="
 flex
 gap-2
 "
      >

        <Upload size={18} />
        Version

      </button>
      <button
        onClick={onLock}
        className="
 flex
 gap-2
 text-yellow-500
 "
      >

        {isLocked
          ? "Unlock"
          : "Lock"}

      </button>
      <button
        className="
        flex
        gap-2
        text-green-500
        "
      >
        <Rocket size={18} />
        Publish
      </button>

    </div>

  );

}
