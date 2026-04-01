'use client';

import { useAuth } from '@/lib/auth';
import NorthStarMetric from '@/components/NorthStarMetric';
import KpiCard from '@/components/KpiCard';
import ActionAlert from '@/components/ActionAlert';
import ArrChart from '@/components/ArrChart';
import { NORTH_STAR, CEO_KPIS, P0_ACTIONS, KEY_DECISIONS, CEO_SUMMARY } from '@/data/mock';

export default function CeoDashboard() {
  const { user } = useAuth();
  const riskKpis = CEO_KPIS.filter((k) => k.status === 'risk');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">CEO Dashboard</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            {user?.name} / 2026年3月 / 株式会社アネストシステム
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-tertiary)]">最終更新</p>
          <p className="text-sm text-[var(--text-secondary)]">2026-03-20</p>
        </div>
      </div>

      {/* CEO Summary */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-4">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{CEO_SUMMARY}</p>
      </div>

      {/* Critical Alerts */}
      {riskKpis.length > 0 && (
        <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-4">
          <h2 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            要対応アラート（{riskKpis.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {riskKpis.map((kpi) => (
              <KpiCard key={kpi.api_key} kpi={kpi} compact />
            ))}
          </div>
        </div>
      )}

      {/* North Star */}
      <NorthStarMetric kpi={NORTH_STAR} />

      {/* Main KPI Grid */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-tertiary)] mb-3">主要KPI</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CEO_KPIS.filter((k) => !riskKpis.includes(k)).map((kpi) => (
            <KpiCard key={kpi.api_key} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* Two Column: Chart + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArrChart />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] flex items-center gap-2">
            P0/P1 アクション
            <span className="text-xs text-[var(--text-tertiary)] opacity-60">（即時〜今週中）</span>
          </h2>
          {P0_ACTIONS.map((action, i) => (
            <ActionAlert key={i} action={action} />
          ))}
        </div>
      </div>

      {/* Key Decisions */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-tertiary)] mb-3">重要意思決定</h2>
        <div className="space-y-2">
          {KEY_DECISIONS.map((d, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-3 flex items-center gap-3 transition-all hover:border-[var(--border-strong)]">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ${
                d.priority === 'CRITICAL' ? 'bg-red-500/15 text-red-400' :
                d.priority === 'HIGH' ? 'bg-amber-500/15 text-amber-400' :
                'bg-[var(--hover-bg)] text-[var(--text-tertiary)]'
              }`}>{d.priority}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{d.title}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{d.owner} / 期限: {d.due_date}</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                d.status === 'done' ? 'bg-emerald-500/15 text-emerald-400' :
                d.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400' :
                'bg-[var(--hover-bg)] text-[var(--text-tertiary)]'
              }`}>{d.status === 'pending' ? '未着手' : d.status === 'in_progress' ? '進行中' : '完了'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
