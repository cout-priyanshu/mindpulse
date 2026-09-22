import React from 'react';
import { TrendChartPoint } from '../types';

export const TrendChart: React.FC<{ data: TrendChartPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const width = 640;
  const height = 220;
  const padding = 36;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Energy is 1-5 -> map to Y
  const getEnergyY = (val: number) => padding + graphHeight - ((val - 1) / 4) * graphHeight;
  // Consistency is 0-100% -> map to Y
  const getConsistencyY = (val: number) => padding + graphHeight - (val / 100) * graphHeight;
  // Late night hours is 0-4h -> map to Y
  const getLateNightY = (val: number) => padding + graphHeight - (val / 4) * graphHeight;

  const getX = (idx: number) => padding + (idx / (data.length - 1)) * graphWidth;

  const energyPoints = data.map((d, i) => `${getX(i)},${getEnergyY(d.energy)}`).join(' ');
  const consistencyPoints = data.map((d, i) => `${getX(i)},${getConsistencyY(d.consistency)}`).join(' ');
  const lateNightPoints = data.map((d, i) => `${getX(i)},${getLateNightY(d.lateNightHours)}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lateNightFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = padding + graphHeight * (1 - p);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#312e81" strokeDasharray="3 3" strokeOpacity="0.4" />
              </g>
            );
          })}

          {/* Area fill for Energy */}
          <polygon
            points={`${padding},${padding + graphHeight} ${energyPoints} ${width - padding},${padding + graphHeight}`}
            fill="url(#energyFill)"
          />

          {/* Area fill for Late Night Hours */}
          <polygon
            points={`${padding},${padding + graphHeight} ${lateNightPoints} ${width - padding},${padding + graphHeight}`}
            fill="url(#lateNightFill)"
          />

          {/* Lines */}
          <polyline fill="none" stroke="#a855f7" strokeWidth="2.5" points={consistencyPoints} />
          <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={energyPoints} />
          <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={lateNightPoints} />

          {/* Dots and Labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const yEnergy = getEnergyY(d.energy);
            const yLateNight = getLateNightY(d.lateNightHours);
            return (
              <g key={i}>
                {/* Day label on X axis */}
                <text x={x} y={height - 12} textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="sans-serif">
                  {d.day}
                </text>
                {/* Energy circle */}
                <circle cx={x} cy={yEnergy} r="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                {/* Late night circle */}
                <circle cx={x} cy={yLateNight} r="3.5" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
            <span className="text-indigo-200">Daily Energy Self-Report (1-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-400"></span>
            <span className="text-indigo-200">Study Timing Consistency (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-indigo-200">Late-Night Study (Hours past midnight)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
