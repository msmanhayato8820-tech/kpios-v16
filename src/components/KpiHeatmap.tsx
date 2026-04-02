'use client';

import { ALL_DEPARTMENT_KPIS } from '@/data/mock';

const STATUS_COLORS = {
  good: 'bg-emerald-500/70',
  warning: 'bg-amber-500/70',
  risk: 'bg-red-500/70',
};

export default function KpiHeatmap() {
  const departments = Object.entries(ALL_DEPARTMENT_KPIS);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">部門横断KPIヒートマップ</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {departments.map(([dept, kpis]) => (
            <div key={dept} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[var(--text-secondary)] w-12 shrink-0 font-medium">{dept}</span>
              <div className="flex gap-1 flex-1">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.api_key}
                    className={`group relative h-8 flex-1 rounded-md ${STATUS_COLORS[kpi.status]} cursor-default transition-all hover:scale-y-125`}
                    title={`${kpi.name}: ${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                      <div className="bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                        <p className="text-[10px] font-medium text-[var(--text-primary)]">{kpi.name}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{kpi.value}{kpi.unit === '%' ? '%' : ` ${kpi.unit}`} / 目標 {kpi.target}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1 shrink-0">
                <span className="text-[10px] text-emerald-400">{kpis.filter(k => k.status === 'good').length}</span>
                <span className="text-[10px] text-amber-400">{kpis.filter(k => k.status === 'warning').length}</span>
                <span className="text-[10px] text-red-400">{kpis.filter(k => k.status === 'risk').length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/70" /><span className="text-[10px] text-[var(--text-tertiary)]">Good</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500/70" /><span className="text-[10px] text-[var(--text-tertiary)]">Warning</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/70" /><span className="text-[10px] text-[var(--text-tertiary)]">Risk</span></div>
      </div>
    </div>
  );
}
