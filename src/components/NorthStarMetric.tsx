'use client';

import { Kpi } from '@/types';

export default function NorthStarMetric({ kpi }: { kpi: Kpi }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-[var(--card-bg)] to-purple-600/10 p-6 shadow-[var(--shadow-card)]">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-yellow-400 text-base">⭐</span>
          <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">North Star Metric</span>
        </div>
        <h2 className="text-base text-[var(--text-secondary)] mb-3">{kpi.name}</h2>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold text-[var(--text-primary)]">
            {kpi.value != null ? `${kpi.value}%` : '未計測'}
          </span>
          <div className="flex flex-col">
            <span className="text-sm text-emerald-400 font-semibold">{kpi.mom_change}</span>
            <span className="text-xs text-[var(--text-tertiary)]">目標 {kpi.target}%</span>
          </div>
        </div>
        <p className="text-sm text-[var(--text-tertiary)] mt-3 leading-relaxed">
          目標の{kpi.target}%を大幅に上回る{kpi.value != null ? `${kpi.value}%` : '未計測'}で推移。成長は健全だがDenso集中度の分散が次の課題。
        </p>
      </div>
    </div>
  );
}
