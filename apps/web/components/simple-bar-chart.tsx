"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: { label: string; total: number }[];
  color?: string;
};

export function SimpleBarChart({ data, color = "#c88b3a" }: Props) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e3e9f2" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6a7890" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6a7890" }} />
          <Tooltip />
          <Bar dataKey="total" fill={color} radius={[10, 10, 0, 0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
