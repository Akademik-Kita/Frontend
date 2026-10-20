import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { DIMENSIONS } from '../../config/interestInstrument';
import type { InterestScores } from '../../types/profile';

interface InterestRadarChartProps {
  scores: InterestScores;
}

export function InterestRadarChart({ scores }: InterestRadarChartProps) {
  const data = DIMENSIONS.map((dimension) => ({
    label: dimension.label,
    score: scores[dimension.key],
  }));

  return (
    <div
      role="img"
      aria-label={`Grafik radar minat: ${data.map((item) => `${item.label} ${item.score}`).join(', ')}`}
      className="h-[340px] w-full sm:h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E3E6F0" />
          <PolarAngleAxis dataKey="label" tick={{ fill: '#252B42', fontSize: 13, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={5} tick={{ fill: '#5B6380', fontSize: 11 }} />
          <Radar name="Skor" dataKey="score" stroke="#4569E8" strokeWidth={2} fill="#4569E8" fillOpacity={0.2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
