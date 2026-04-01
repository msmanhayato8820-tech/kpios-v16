'use client';

import { Kpi } from '@/types';

function formatValue(value: number | null, unit: string): string {
  if (value === null) return '未計測';
  if (unit === '億円') return `${value}億円`;
  if (unit === '万円') return `${value.toLocaleString()}万円`;
  if (unit === '万円/月') return `${value.toLocaleString()}万円/月`;
  if (unit === '万円/人') return `${value}万円/人`;
  if (unit === '万円/月/人') return `${value}万円`;
  if (unit === '台') return `${value.toLocaleString()}台`;
  if (unit === '社') return `${value}社`;
  if (unit === '%') return `${value}%`;
  if (unit === '件/月') return `${value}件/月`;
  if (unit === '件') return `${value.toLocaleString()}件`;
  if (unit === '名') return `${value}名`;
  if (unit === '日') return `${value}日`;
  if (unit === '時間') return `${value}h`;
  if (unit === '点') return `${value}点`;
  if (unit === 'ヶ月') return `${value}ヶ月`;
  return `${value}${unit}`;
}

const STATUS_STYLES = {
  good: { ring: 'ring-emerald-500/20', dot: 'bg-emerald-400', badge: 'text-emerald-500 bg-emerald-500/10' },
  warning: { ring: 'ring-amber-500/20', dot: 'bg-amber-400', badge: 'text-amber-500 bg-amber-500/10' },
  risk: { ring: 'ring-red-500/20', dot: 'bg-red-400', badge: 'text-red-500 bg-red-500/10' },
};

export default function KpiCard({ kpi, compact }: { kpi: Kpi; compact?: boolean }) {
  const s = STATUS_STYLES[kpi.status];
  const progress = kpi.target > 0 ? Math.min(((kpi.value ?? 0) / kpi.target) * 100, 150) : 0;
  const isInverse = ['churn_rate_pct', 'sla_violation_rate', 'denso_concentration', 'cs_sla_violation_rate', 'attrition_rate', 'recruitment_unit_cost', 'recruitment_lead_time', 'labor_cost_ratio', 'installation_time', 'installation_delay_months', 'support_tickets', 'ops_backlog', 'cs_avg_response_time', 'cfo_burn_rate', 'high_risk_accounts', 'cs_rescue_plan_progress'].includes(kpi.api_key);

  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] ring-1 ${s.ring} ${compact ? 'p-3' : 'p-4'} transition-all hover:border-[var(--border-strong)] hover:bg-[var(--card-bg-hover)]`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
          <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">{kpi.name}</h3>
        </div>
        {kpi.priority && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-2 ${
            kpi.priority === 'CRITICAL' ? 'bg-red-500/15 text-red-400' :
            kpi.priority === 'HIGH' ? 'bg-amber-500/15 text-amber-400' :
            'bg-[var(--hover-bg)] text-[var(--text-tertiary)]'
          }`}>{kpi.priority}</span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{formatValue(kpi.value, kpi.unit)}</span>
        <span className={`text-xs font-medium ${s.badge} px-1.5 py-0.5 rounded-md`}>{kpi.mom_change}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isInverse
                ? (kpi.status === 'good' ? 'bg-emerald-500' : kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500')
                : (progress >= 100 ? 'bg-emerald-500' : progress >= 70 ? 'bg-amber-500' : 'bg-red-500')
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-[11px] text-[var(--text-tertiary)] whitespace-nowrap">
          {kpi.target !== null ? formatValue(kpi.target, kpi.unit) : ''}
        </span>
      </div>

      {kpi.next_action && !compact && (
        <p className="text-xs text-[var(--text-tertiary)] mt-2.5 line-clamp-2 leading-relaxed">→ {kpi.next_action}</p>
      )}
    </div>
  );
}
