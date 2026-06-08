import { Plus, Trash2 } from "lucide-react";

export default function PropertyBuilder({
  propsData,
  setPropsData,
}) {

  const addProp = () => {

    setPropsData([
      ...propsData,
      {
        name: "",
        type: "string",
        default: "",
        required: false,
        options: [],
      },
    ]);

  };

  const updateProp = (
    index,
    field,
    value
  ) => {

    const updated = [...propsData];

    updated[index][field] =
      value;

    setPropsData(updated);

  };

  const removeProp = (
    index
  ) => {

    setPropsData(
      propsData.filter(
        (_, i) =>
          i !== index
      )
    );

  };

  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="font-semibold">
          Properties
        </h2>

        <button
          onClick={addProp}
          className="
          px-3 py-2
          bg-black
          text-white
          rounded-lg
          flex gap-2
          "
        >
          <Plus size={16}/>
          Add
        </button>

      </div>

      {propsData.map(
        (prop, index) => (

          <div
            key={index}
            className="
            border
            rounded-xl
            p-3
            space-y-2
            "
          >

            <input
              value={prop.name}
              placeholder="Property Name"
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
              p-2
              rounded
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
              p-2
              rounded
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
              value={prop.default}
              placeholder="Default"
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
              p-2
              rounded
              "
            />

            <button
              onClick={() =>
                removeProp(index)
              }
              className="
              text-red-500
              "
            >
              <Trash2 size={16}/>
            </button>

          </div>

        )
      )}

    </div>

  );

}