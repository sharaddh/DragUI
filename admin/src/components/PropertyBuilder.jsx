import {
  Plus,
  Trash2
} from "lucide-react";

export default function PropertyBuilder({
  propsData,
  setPropsData
}) {

  const addProp = () => {

    setPropsData([
      ...propsData,
      {
        name: "",
        type: "string",
        default: "",
        required: false,
        options: []
      }
    ]);

  };

  const updateProp = (
    index,
    field,
    value
  ) => {

    const updated =
      [...propsData];

    updated[index][field] =
      value;

    setPropsData(
      updated
    );

  };

  const removeProp =
    (index) => {

      setPropsData(
        propsData.filter(
          (_, i) =>
            i !== index
        )
      );

    };

  return (

    <div className="space-y-4">

      <div className="flex justify-between">

        <h2 className="font-semibold text-lg">
          Properties
        </h2>

        <button
          onClick={addProp}
          className="
          flex gap-2
          px-3 py-2
          rounded-lg
          bg-black
          text-white
          "
        >
          <Plus size={16}/>
          Add Prop
        </button>

      </div>

      {propsData.map(
        (prop, index) => (

          <div
            key={index}
            className="
            border
            rounded-xl
            p-4
            space-y-3
            "
          >

            <input
              placeholder="Property Name"
              value={prop.name}
              onChange={(e)=>
                updateProp(
                  index,
                  "name",
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-lg
              p-2
              "
            />

            <select
              value={prop.type}
              onChange={(e)=>
                updateProp(
                  index,
                  "type",
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-lg
              p-2
              "
            >

              <option value="string">
                String
              </option>

              <option value="number">
                Number
              </option>

              <option value="boolean">
                Boolean
              </option>

              <option value="color">
                Color
              </option>

              <option value="select">
                Select
              </option>

            </select>

            <input
              placeholder="Default Value"
              value={prop.default}
              onChange={(e)=>
                updateProp(
                  index,
                  "default",
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-lg
              p-2
              "
            />

            <label className="flex gap-2">

              <input
                type="checkbox"
                checked={prop.required}
                onChange={(e)=>
                  updateProp(
                    index,
                    "required",
                    e.target.checked
                  )
                }
              />

              Required

            </label>

            <button
              onClick={() =>
                removeProp(index)
              }
              className="
              text-red-500
              "
            >
              <Trash2 size={18}/>
            </button>

          </div>

        )
      )}

    </div>

  );

}