import React from 'react';
import type { Detection } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface SpatialDistributionChartProps {
  detections: Detection[];
}

export const SpatialDistributionChart: React.FC<SpatialDistributionChartProps> = ({ detections }) => {
  const bins = [
    { range: '0-3m', count: 0 },
    { range: '3-6m', count: 0 },
    { range: '6-9m', count: 0 },
    { range: '9-12m', count: 0 },
    { range: '12m+', count: 0 },
  ];

  detections.forEach((d) => {
    if (d.depth_m !== null) {
      const z = d.depth_m;
      if (z < 3) bins[0].count++;
      else if (z < 6) bins[1].count++;
      else if (z < 9) bins[2].count++;
      else if (z < 12) bins[3].count++;
      else bins[4].count++;
    }
  });

  return (
    <div className="tech-card rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Spatial Depth Distribution (Z Distance)
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
