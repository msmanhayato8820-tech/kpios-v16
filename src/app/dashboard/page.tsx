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
  const warningKpis = CEO_KPIS.filter((k) => k.status === 'warning');
  const goodKpis = CEO_KPIS.filter((k) => k.status === 'good');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CEO Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.name} / 2026年3月 / 株式会社アネストシステム
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">最終更新</p>
          <p className="text-sm text-gray-400">2026-03-20</p>
        </div>
      </div>

      {/* CEO Summary */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-300 leading-relaxed">{CEO_SUMMARY}</p>
      </div>

      {/* Critical Alerts */}
      {riskKpis.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h2 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            要対応アラート（{riskKpis.length}件）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
        <h2 className="text-sm font-medium text-gray-400 mb-3">主要KPI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CEO_KPIS.filter((k) => !riskKpis.includes(k)).map((kpi) => (
            <KpiCard key={kpi.api_key} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* Two Column: Chart + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArrChart />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            P0/P1 アクション
            <span className="text-xs text-gray-600">（即時〜今週中）</span>
          </h2>
          {P0_ACTIONS.map((action, i) => (
            <ActionAlert key={i} action={action} />
          ))}
        </div>
      </div>

      {/* Key Decisions */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">重要意思決定</h2>
        <div className="space-y-2">
          {KEY_DECISIONS.map((d, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                d.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                d.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>{d.priority}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">{d.title}</p>
                <p className="text-xs text-gray-500">{d.owner} / 期限: {d.due_date}</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                d.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                d.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-700 text-gray-300'
              }`}>{d.status === 'pending' ? '未着手' : d.status === 'in_progress' ? '進行中' : '完了'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
