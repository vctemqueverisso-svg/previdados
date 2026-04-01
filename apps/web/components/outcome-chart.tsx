"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: { label: string; success: number; failure: number }[];
};

export function OutcomeChart({ data }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e3e9f2" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6a7890" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6a7890" }} />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: 12 }} />
          <Bar dataKey="success" name="Favoráveis" fill="#47647d" radius={[8, 8, 0, 0]} maxBarSize={42} />
          <Bar dataKey="failure" name="Desfavoráveis" fill="#b55d52" radius={[8, 8, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
