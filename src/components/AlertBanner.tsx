'use client';

import { Kpi } from '@/types';

export default function AlertBanner({ kpis }: { kpis: Kpi[] }) {
  const riskKpis = kpis.filter((k) => k.status === 'risk');
  if (riskKpis.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-3 animate-fade-in">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-red-400 whitespace-nowrap">ALERT ({riskKpis.length})</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {riskKpis.map((kpi) => (
            <span
              key={kpi.api_key}
              className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap"
            >
              {kpi.name}: {kpi.value}{kpi.unit === '%' ? '%' : ` ${kpi.unit}`} (目標: {kpi.target}{kpi.unit === '%' ? '%' : ''})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
