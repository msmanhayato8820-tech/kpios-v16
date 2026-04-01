'use client';

import { Kpi } from '@/types';

export default function NorthStarMetric({ kpi }: { kpi: Kpi }) {
  return (
    <div className="bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-yellow-400 text-lg">⭐</span>
        <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">North Star Metric</span>
      </div>
      <h2 className="text-lg text-gray-300 mb-2">{kpi.name}</h2>
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-bold text-white">{kpi.value}%</span>
        <div className="flex flex-col">
          <span className="text-sm text-emerald-400 font-medium">{kpi.mom_change}</span>
          <span className="text-xs text-gray-500">目標 {kpi.target}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3">
        目標の{kpi.target}%を大幅に上回る{kpi.value}%で推移。成長は健全だがDenso集中度の分散が次の課題。
      </p>
    </div>
  );
}
