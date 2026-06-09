import {
  Pencil,
  Trash2,
  Rocket,
  Archive
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

export default function ComponentCard({
  component,
  onDelete,
  onPublish,
  onArchive
}) {

  const navigate =
    useNavigate();

  return (

    <div
      className="
      bg-white
      border
      rounded-2xl
      p-5
      flex
      justify-between
      items-center
      "
    >

      <div>

        <h3
          className="
          text-lg
          font-semibold
          "
        >
          {component.name}
        </h3>

        <p
          className="
          text-zinc-500
          "
        >
          {component.category}
        </p>

      </div>

      <div
        className="
        flex
        gap-3
        "
      >

        <button
          onClick={() =>
            navigate(
              `/components/edit/${component._id}`
            )
          }
        >
          <Pencil size={18} />
        </button>

        <button

          onClick={() =>
            onPublish(
              component._id
            )
          }

          className="
 px-3 py-1
 rounded-lg
 bg-green-600
 text-white
 "
        >

          Publish

        </button>

        <button
          onClick={() =>
            onArchive(
              component._id
            )
          }
        >
          <Archive size={18} />
        </button>

        <button
          onClick={() =>
            onDelete(
              component._id
            )
          }
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>

  );

}