'use client';

import { Kpi } from '@/types';

function formatValue(value: number | null, unit: string): string {
  if (value === null) return '未計測';
  if (unit === '億円') return `${value}億円`;
  if (unit === '万円') return `${value.toLocaleString()}万円`;
  if (unit === '台') return `${value.toLocaleString()}台`;
  if (unit === '社') return `${value}社`;
  if (unit === '%') return `${value}%`;
  if (unit === '件/月') return `${value}件/月`;
  return `${value}${unit}`;
}

const STATUS_STYLES = {
  good: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  risk: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
};

export default function KpiCard({ kpi, compact }: { kpi: Kpi; compact?: boolean }) {
  const s = STATUS_STYLES[kpi.status];
  const progress = kpi.target > 0 ? Math.min(((kpi.value ?? 0) / kpi.target) * 100, 150) : 0;
  const isInverse = kpi.api_key === 'churn_rate_pct' || kpi.api_key === 'sla_violation_rate' || kpi.api_key === 'denso_concentration';

  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-4 ${compact ? 'p-3' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <h3 className="text-sm font-medium text-gray-300">{kpi.name}</h3>
        </div>
        {kpi.priority && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            kpi.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
            kpi.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{kpi.priority}</span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white">{formatValue(kpi.value, kpi.unit)}</span>
        <span className={`text-xs ${s.text}`}>{kpi.mom_change}</span>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isInverse
                ? (kpi.status === 'good' ? 'bg-emerald-500' : kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500')
                : (progress >= 100 ? 'bg-emerald-500' : progress >= 70 ? 'bg-amber-500' : 'bg-red-500')
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          目標: {formatValue(kpi.target, kpi.unit)}
        </span>
      </div>

      {kpi.next_action && !compact && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">→ {kpi.next_action}</p>
      )}
    </div>
  );
}
