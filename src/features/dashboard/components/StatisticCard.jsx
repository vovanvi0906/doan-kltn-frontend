import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Enterprise Metric Card (Linear / Vercel style)
 * Tuân thủ 8pt Grid, border-slate-200 dark:border-slate-800,
 * font-mono metrics, trend badge, và micro-sparkline SVG.
 */
export default function StatisticCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend = 'up',
  trendValue,
  colorScheme = 'blue',
  sparklineData = [35, 42, 38, 55, 48, 62, 70],
  onClick,
}) {
  const colorMap = {
    blue: {
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200/60 dark:border-blue-800/40',
      stroke: '#3b82f6',
    },
    emerald: {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
      stroke: '#10b981',
    },
    amber: {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/60 dark:border-amber-800/40',
      stroke: '#f59e0b',
    },
    purple: {
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200/60 dark:border-purple-800/40',
      stroke: '#8b5cf6',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  // Tính toán SVG Path cho Sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 28;

  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((v - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-xl bg-white dark:bg-[#1e293b]/60 border border-slate-200 dark:border-slate-800 shadow-2xs transition-all duration-150 flex flex-col justify-between select-none ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs' : ''
      }`}
    >
      {/* Card Header: Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${scheme.bg} ${scheme.border} ${scheme.text} transition-transform group-hover:scale-105 shrink-0`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Card Body: Big Mono Metric + Sparkline */}
      <div className="flex items-end justify-between my-2">
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
          {value}
        </div>

        {/* Micro Sparkline SVG */}
        <div className="w-20 h-7 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <polyline
              fill="none"
              stroke={scheme.stroke}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Card Footer: Trend Badge & Subtext */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate mr-2">
          {subtext}
        </span>

        {trendValue && (
          <div
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10.5px] font-semibold shrink-0 border ${
              trend === 'down'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40'
            }`}
          >
            {trend === 'down' ? (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            )}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}
