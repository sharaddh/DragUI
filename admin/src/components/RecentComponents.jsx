export default function RecentComponents({
  items,
}) {

  return (

    <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-5">

      <h2 className="font-semibold mb-4">
        Recent Components
      </h2>

      <div className="space-y-3">

        {items?.map(
          (
            component
          ) => (

            <div
              key={component._id}
              className="flex justify-between"
            >

              <span>
                {component.name}
              </span>

              <span>
                {component.version}
              </span>

            </div>

          )
        )}

      </div>

    </div>

  );

}