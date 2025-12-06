"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  title: string;
  data: ChartDataItem[];
}

export default function HorizontalBarChart({
  title,
  data,
}: HorizontalBarChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-5">
        {title}
      </h2>

      <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 20, left: 50, bottom: 10 }}
            barGap={25}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 16, fill: "#444", fontWeight: 500 }}
              width={160}
            />

            <Tooltip
              cursor={{ fill: "#f8f8f8" }}
              itemStyle={{ fontSize: "16px", fontWeight: 500 }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: "8px 12px",
                border: "1px solid #eee",
              }}
            />

            <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={36}>
              {data.map((entry, index) => (
                <Cell key={index} fill="#FFCC00" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
