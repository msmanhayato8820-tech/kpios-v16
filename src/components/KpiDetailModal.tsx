'use client';

import { Kpi } from '@/types';
import { KPI_TRENDS, KPI_DEPENDENCIES } from '@/data/mock';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 48;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={color} />
    </svg>
  );
}

export default function KpiDetailModal({ kpi, onClose }: { kpi: Kpi; onClose: () => void }) {
  const trend = KPI_TRENDS[kpi.api_key];
  const deps = KPI_DEPENDENCIES[kpi.api_key] || [];
  const trendColor = kpi.status === 'good' ? '#10b981' : kpi.status === 'warning' ? '#f59e0b' : '#ef4444';
  const months = ['10月', '11月', '12月', '1月', '2月', '3月'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${kpi.status === 'good' ? 'bg-emerald-400' : kpi.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{kpi.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)] transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Value & Target */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-[var(--hover-bg)] p-3 text-center">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">現在値</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.value !== null ? kpi.value.toLocaleString() : '-'}{kpi.unit === '%' || kpi.unit === '点' ? kpi.unit : ''}</p>
              {kpi.unit !== '%' && kpi.unit !== '点' && <p className="text-[10px] text-[var(--text-tertiary)]">{kpi.unit}</p>}
            </div>
            <div className="rounded-xl bg-[var(--hover-bg)] p-3 text-center">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">目標</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.target.toLocaleString()}{kpi.unit === '%' || kpi.unit === '点' ? kpi.unit : ''}</p>
              {kpi.unit !== '%' && kpi.unit !== '点' && <p className="text-[10px] text-[var(--text-tertiary)]">{kpi.unit}</p>}
            </div>
            <div className="rounded-xl bg-[var(--hover-bg)] p-3 text-center">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">前月比</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.mom_change}</p>
            </div>
          </div>

          {/* Gauge */}
          <div className="flex justify-center">
            <GaugeCircle value={kpi.value ?? 0} target={kpi.target} status={kpi.status} />
          </div>

          {/* Trend */}
          {trend && (
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">6ヶ月トレンド</h3>
              <div className="rounded-xl bg-[var(--hover-bg)] p-3">
                <Sparkline data={trend} color={trendColor} />
                <div className="flex justify-between mt-1">
                  {months.map((m) => (
                    <span key={m} className="text-[9px] text-[var(--text-tertiary)]">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Definition */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">KPI定義</h3>
            <div className="rounded-xl border border-[var(--border)] p-3 space-y-1.5 text-xs">
              <div className="flex gap-2"><span className="text-[var(--text-tertiary)] w-16 shrink-0">計算式</span><span className="text-[var(--text-primary)]">{kpi.definition.numerator} / {kpi.definition.denominator}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-tertiary)] w-16 shrink-0">スコープ</span><span className="text-[var(--text-primary)]">{kpi.definition.scope}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-tertiary)] w-16 shrink-0">データ元</span><span className="text-[var(--text-primary)]">{kpi.definition.source}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-tertiary)] w-16 shrink-0">更新頻度</span><span className="text-[var(--text-primary)]">{kpi.definition.refresh_cycle}</span></div>
              {kpi.definition.note && <div className="flex gap-2"><span className="text-[var(--text-tertiary)] w-16 shrink-0">備考</span><span className="text-[var(--text-primary)]">{kpi.definition.note}</span></div>}
            </div>
          </div>

          {/* Dependencies */}
          {deps.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">関連KPI</h3>
              <div className="flex flex-wrap gap-2">
                {deps.map((d) => (
                  <span key={d} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">{d}</span>
                ))}
              </div>
            </div>
          )}

          {/* Owner & Action */}
          {(kpi.owner || kpi.next_action) && (
            <div className="rounded-xl border border-[var(--border)] p-3 space-y-1.5">
              {kpi.owner && <p className="text-xs text-[var(--text-secondary)]">担当: <span className="text-[var(--text-primary)] font-medium">{kpi.owner}</span></p>}
              {kpi.next_action && <p className="text-xs text-[var(--text-secondary)]">次のアクション: <span className="text-[var(--text-primary)]">{kpi.next_action}</span></p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GaugeCircle({ value, target, status }: { value: number; target: number; status: string }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 150) : 0;
  const displayPct = Math.min(pct, 100);
  const r = 50;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (displayPct / 100) * circumference;
  const color = status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--hover-bg)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{Math.round(pct)}%</span>
        <span className="text-[10px] text-[var(--text-tertiary)]">達成率</span>
      </div>
    </div>
  );
}
