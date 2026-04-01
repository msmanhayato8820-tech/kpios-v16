'use client';

import { Kpi } from '@/types';
import KpiCard from './KpiCard';

export default function DashboardPage({
  title,
  subtitle,
  kpis,
  children,
}: {
  title: string;
  subtitle?: string;
  kpis: Kpi[];
  children?: React.ReactNode;
}) {
  const riskKpis = kpis.filter((k) => k.status === 'risk');
  const otherKpis = kpis.filter((k) => k.status !== 'risk');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{subtitle}</p>}
      </div>

      {riskKpis.length > 0 && (
        <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-4">
          <h2 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            要対応（{riskKpis.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {riskKpis.map((kpi) => (
              <KpiCard key={kpi.api_key} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-[var(--text-tertiary)] mb-3">KPI一覧</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {otherKpis.map((kpi) => (
            <KpiCard key={kpi.api_key} kpi={kpi} />
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
