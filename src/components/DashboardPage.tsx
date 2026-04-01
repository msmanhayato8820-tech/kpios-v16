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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {riskKpis.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h2 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            要対応（{riskKpis.length}件）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {riskKpis.map((kpi) => (
              <KpiCard key={kpi.api_key} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">KPI一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {otherKpis.map((kpi) => (
            <KpiCard key={kpi.api_key} kpi={kpi} />
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
