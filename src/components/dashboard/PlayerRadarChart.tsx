"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type PlayerRadarChartProps = {
  tecnica: number;
  tactica: number;
  fisico: number;
};

export function PlayerRadarChart({ tecnica, tactica, fisico }: PlayerRadarChartProps) {
  const data = [
    { subject: "Técnica", value: tecnica },
    { subject: "Táctica", value: tactica },
    { subject: "Físico", value: fisico },
  ];

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#d4d4d4" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(0,0,0,0.45)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "rgba(0,0,0,0.35)", fontSize: 10 }}
          />
          <Radar
            name="Perfil"
            dataKey="value"
            stroke="#111111"
            fill="#111111"
            fillOpacity={0.12}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
