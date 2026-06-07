export default function StatCard({
  title,
  value,
  icon,
}) {

  return (

    <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-5">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div>
          {icon}
        </div>

      </div>

    </div>

  );

}