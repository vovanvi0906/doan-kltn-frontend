import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatisticCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  colorScheme = 'blue',
  onClick,
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-600 dark:text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-600 dark:text-amber-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800/60',
      text: 'text-purple-600 dark:text-purple-400',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-600 dark:text-rose-400',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1e293b]/70 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none pt-0.5">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border ${scheme.bg} ${scheme.border} ${scheme.text} transition-transform group-hover:scale-105 shadow-2xs shrink-0`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span className="truncate pr-1 text-slate-400 dark:text-slate-500">{subtext}</span>
        {trendValue && (
          <span
            className={`inline-flex items-center font-bold shrink-0 text-[10.5px] ${
              trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {trend === 'down' ? (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            )}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
