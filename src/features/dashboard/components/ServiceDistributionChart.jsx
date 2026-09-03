import React from 'react';

/**
 * ServiceDistributionChart Component
 * Modern SVG Donut Chart for FixGo Service Distribution
 * Linear / Vercel style with centered metric, color-coded rings, and detailed legend.
 */
export default function ServiceDistributionChart({ services = [], totalOrders = 0 }) {
  // Chu vi hình tròn r = 36: 2 * π * 36 ≈ 226.19
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  // Tính toán strokeDashoffset lũy kế cho từng phân đoạn donut
  let cumulativePercentage = 0;
  const segments = services.map((s) => {
    const strokeDasharray = `${((s.percentage || 0) / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += (s.percentage || 0);
    return {
      ...s,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full py-1">
      {/* SVG Donut Chart with Centered Total */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Base Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-100 dark:text-slate-800/60"
          />

          {/* Render Segments */}
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={seg.color || '#3b82f6'}
              strokeWidth="10"
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="butt"
              className="transition-all duration-500 hover:opacity-80 cursor-pointer"
            />
          ))}
        </svg>

        {/* Center Metric Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
            {totalOrders}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Tổng đơn
          </span>
        </div>
      </div>

      {/* Distribution Legend List */}
      <div className="flex-1 w-full space-y-1.5 min-w-0">
        {services.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Chưa có phát sinh đơn hàng theo danh mục
          </div>
        ) : (
          services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="p-1.5 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors duration-150 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: service.color || '#3b82f6' }}
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {service.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {service.count ?? 0} đơn
                </span>
                <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                  {service.percentage ?? 0}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
