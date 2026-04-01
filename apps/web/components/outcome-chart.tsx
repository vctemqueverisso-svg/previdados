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
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eadfce" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#667289" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#667289" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" name="Favoraveis" fill="#40513b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="failure" name="Desfavoraveis" fill="#9f3a38" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
