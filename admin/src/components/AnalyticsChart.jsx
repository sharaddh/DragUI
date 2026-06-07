import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsChart({
  data,
}) {

  return (

    <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-5">

      <h2 className="font-semibold mb-5">
        Growth Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <AreaChart
          data={data}
        >

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

}