'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { SimulatorParams, SegmentParams } from '@/types';
import { DEFAULT_SIMULATOR_PARAMS } from '@/data/mock';

// ===== 100億宣言 事業セグメント定義 =====
const DEFAULT_SEGMENTS: SegmentParams[] = [
  { name: 'GrowthBOX (GBC)', color: '#3b82f6', currentRevenue: 12, growthRate: 8, enabled: true },
  { name: 'GrowthBOX-DR', color: '#8b5cf6', currentRevenue: 5, growthRate: 10, enabled: true },
  { name: 'BSS', color: '#06b6d4', currentRevenue: 4, growthRate: 25, enabled: true },
  { name: 'BSS for ALC', color: '#10b981', currentRevenue: 2, growthRate: 30, enabled: true },
  { name: 'BPaaS', color: '#f59e0b', currentRevenue: 0.5, growthRate: 50, enabled: true },
  { name: 'AI/IoT新製品', color: '#ef4444', currentRevenue: 0, growthRate: 80, enabled: true },
  { name: 'OEM/パートナー', color: '#ec4899', currentRevenue: 1.5, growthRate: 15, enabled: true },
  { name: '新製品・新規事業', color: '#14b8a6', currentRevenue: 0, growthRate: 60, enabled: true },
];

const MILESTONE_YEARS = [2028, 2030, 2033, 2035] as const;

// ===== 共通スライダー =====
function SliderInput({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm text-[var(--text-secondary)]">{label}</label>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{value.toLocaleString()}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-0.5">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

// ===== ARRシミュレーション（従来） =====
function simulate(params: SimulatorParams) {
  const { customers, monthlyNetNew, arpu, churnRate } = params;
  const years: { year: number; arr: number; vehicles: number; customers: number }[] = [];
  let currentCustomers = customers;
  const vehiclesPerCustomer = customers > 0 ? params.managedVehicles / customers : 0;
  for (let y = 2026; y <= 2035; y++) {
    const monthlyChurnRate = churnRate / 100 / 12;
    let yearEndCustomers = currentCustomers;
    for (let m = 0; m < 12; m++) {
      const monthlyChurn = Math.round(yearEndCustomers * monthlyChurnRate);
      yearEndCustomers = yearEndCustomers + monthlyNetNew - monthlyChurn;
    }
    currentCustomers = Math.max(0, yearEndCustomers);
    const currentArr = (currentCustomers * arpu) / 10000;
    years.push({ year: y, arr: Math.round(currentArr * 10) / 10, vehicles: Math.round(currentCustomers * vehiclesPerCustomer), customers: currentCustomers });
  }
  return years;
}

// ===== 100億宣言シミュレーション =====
function simulate100(segments: SegmentParams[]) {
  const data: Record<string, number | string>[] = [];
  for (let y = 2026; y <= 2035; y++) {
    const row: Record<string, number | string> = { year: y };
    let total = 0;
    for (const seg of segments) {
      if (!seg.enabled) { row[seg.name] = 0; continue; }
      const yearsFromNow = y - 2026;
      // AI/IoT and ASEAN start from 2028
      const delay = (seg.name.includes('AI/IoT') || seg.name.includes('新製品')) ? Math.max(0, yearsFromNow - 2) : yearsFromNow;
      const revenue = seg.currentRevenue * Math.pow(1 + seg.growthRate / 100, delay);
      const rounded = Math.round(revenue * 10) / 10;
      row[seg.name] = rounded;
      total += rounded;
    }
    row.total = Math.round(total * 10) / 10;
    data.push(row);
  }
  return data;
}

type Tab = 'arr' | 'hyaku';

export default function SimulatorPage() {
  const [tab, setTab] = useState<Tab>('hyaku');

  // ARR Simulator state
  const [params, setParams] = useState<SimulatorParams>({ ...DEFAULT_SIMULATOR_PARAMS });
  const projection = useMemo(() => simulate(params), [params]);
  const arr2030 = projection.find((p) => p.year === 2030);
  const arr2035 = projection.find((p) => p.year === 2035);
  const update = (key: keyof SimulatorParams) => (val: number) => setParams((prev) => ({ ...prev, [key]: val }));

  // 100億宣言 state
  const [segments, setSegments] = useState<SegmentParams[]>(DEFAULT_SEGMENTS.map(s => ({ ...s })));
  const hyakuData = useMemo(() => simulate100(segments), [segments]);
  const hyaku2030 = hyakuData.find((d) => d.year === 2030);
  const hyaku2035 = hyakuData.find((d) => d.year === 2035);

  const updateSegment = (i: number, key: keyof SegmentParams, val: number | boolean) => {
    setSegments(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Strategy Simulator</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">100億円達成シミュレーター</p>
      </div>

      {/* Tab Switch */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        <button onClick={() => setTab('hyaku')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            tab === 'hyaku' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}>
          100億宣言
        </button>
        <button onClick={() => setTab('arr')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            tab === 'arr' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}>
          ARRシミュレーター
        </button>
      </div>

      {/* ===== 100億宣言 Tab ===== */}
      {tab === 'hyaku' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard label="現在の年間売上" value={`${segments.filter(s => s.enabled).reduce((sum, s) => sum + s.currentRevenue, 0).toFixed(1)}億円`} sub="2026年ベース" />
            <SummaryCard label="2030年 推定売上" value={`${hyaku2030?.total ?? '-'}億円`}
              sub={Number(hyaku2030?.total ?? 0) >= 50 ? '中間目標50億 達成圏内' : `50億まで あと${Math.round(50 - Number(hyaku2030?.total ?? 0))}億`}
              highlight={Number(hyaku2030?.total ?? 0) >= 50 ? 'green' : 'yellow'} />
            <SummaryCard label="2035年 推定売上" value={`${hyaku2035?.total ?? '-'}億円`}
              sub={Number(hyaku2035?.total ?? 0) >= 100 ? '100億円目標 達成!' : `目標まで あと${Math.round(100 - Number(hyaku2035?.total ?? 0))}億円`}
              highlight={Number(hyaku2035?.total ?? 0) >= 100 ? 'green' : 'red'} />
            <SummaryCard label="成長倍率" value={`${(Number(hyaku2035?.total ?? 0) / Math.max(segments.reduce((s, seg) => s + seg.currentRevenue, 0), 0.1)).toFixed(1)}x`}
              sub="10年間の成長" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stacked Area Chart */}
            <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">事業セグメント別 売上成長曲線（2026-2035）</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hyakuData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}億`} />
                    <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
                      formatter={(value) => [`${value}億円`]} />
                    <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '100億円', fill: '#ef4444', fontSize: 11 }} />
                    <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '50億円', fill: '#f59e0b', fontSize: 10 }} />
                    {segments.filter(s => s.enabled).map((seg) => (
                      <Area key={seg.name} type="monotone" dataKey={seg.name} stackId="1"
                        stroke={seg.color} fill={seg.color} fillOpacity={0.6} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Segment Controls */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-4 space-y-3 overflow-y-auto max-h-[520px] scrollbar-hide">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">事業セグメント設定</h3>
              {segments.map((seg, i) => (
                <div key={seg.name} className={`p-3 rounded-lg border transition-all ${seg.enabled ? 'border-[var(--border-strong)] bg-[var(--hover-bg)]' : 'border-[var(--border)] opacity-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: seg.color }} />
                      <span className="text-xs font-medium text-[var(--text-primary)]">{seg.name}</span>
                    </div>
                    <button onClick={() => updateSegment(i, 'enabled', !seg.enabled)}
                      className={`w-8 h-4 rounded-full transition-all ${seg.enabled ? 'bg-blue-500' : 'bg-[var(--border)]'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${seg.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {seg.enabled && (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mb-0.5">
                          <span>現在売上</span><span>{seg.currentRevenue}億円</span>
                        </div>
                        <input type="range" min={0} max={30} step={0.5} value={seg.currentRevenue}
                          onChange={(e) => updateSegment(i, 'currentRevenue', Number(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mb-0.5">
                          <span>年間成長率</span><span>{seg.growthRate}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={1} value={seg.growthRate}
                          onChange={(e) => updateSegment(i, 'growthRate', Number(e.target.value))} className="w-full" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setSegments(DEFAULT_SEGMENTS.map(s => ({ ...s })))}
                className="w-full text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] transition-all">
                リセット
              </button>
            </div>
          </div>

          {/* Milestone Table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">マイルストーン別 事業構成</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">セグメント</th>
                    {MILESTONE_YEARS.map(y => (
                      <th key={y} className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">{y}年</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {segments.filter(s => s.enabled).map(seg => (
                    <tr key={seg.name} className="border-b border-[var(--border)]">
                      <td className="py-2 px-2 text-[var(--text-primary)]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-sm" style={{ background: seg.color }} />
                          {seg.name}
                        </div>
                      </td>
                      {MILESTONE_YEARS.map(y => {
                        const row = hyakuData.find(d => d.year === y);
                        return <td key={y} className="text-right py-2 px-2 text-[var(--text-secondary)]">{row ? `${row[seg.name]}億` : '-'}</td>;
                      })}
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2 px-2 text-[var(--text-primary)]">合計</td>
                    {MILESTONE_YEARS.map(y => {
                      const row = hyakuData.find(d => d.year === y);
                      const total = Number(row?.total ?? 0);
                      return (
                        <td key={y} className={`text-right py-2 px-2 ${total >= 100 ? 'text-emerald-400' : total >= 50 ? 'text-amber-400' : 'text-[var(--text-primary)]'}`}>
                          {row ? `${row.total}億` : '-'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PillarCard title="SaaS型安定成長" items={['GrowthBOX/DR の既存顧客深耕', 'BSS・BSS for ALC の拡販', '2030年 顧客13,000社目標']} color="blue" />
            <PillarCard title="売上構成多角化" items={['BPaaS 本格展開', 'OEM/パートナー収益', 'Denso集中度75%→40%へ']} color="purple" />
            <PillarCard title="事業領域拡張" items={['AI/IoT 予知保全ソリューション', '新製品・新規事業の創出', 'M&A による事業拡大']} color="cyan" />
          </div>
        </>
      )}

      {/* ===== ARR Simulator Tab ===== */}
      {tab === 'arr' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`rounded-xl p-5 border shadow-[var(--shadow-card)] ${(arr2030?.arr ?? 0) >= 100 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/[0.06] border-blue-500/20'}`}>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">2030年 推定ARR</p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{arr2030?.arr ?? '-'}億円</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">顧客数 {arr2030?.customers.toLocaleString() ?? '-'}社</p>
            </div>
            <div className={`rounded-xl p-5 border shadow-[var(--shadow-card)] ${(arr2035?.arr ?? 0) >= 100 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/[0.06] border-amber-500/20'}`}>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">2035年 推定ARR</p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{arr2035?.arr ?? '-'}億円</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">顧客数 {arr2035?.customers.toLocaleString() ?? '-'}社</p>
              {(arr2035?.arr ?? 0) >= 100 ? (
                <p className="text-xs text-emerald-400 mt-1 font-medium">100億円目標達成</p>
              ) : (
                <p className="text-xs text-amber-400 mt-1 font-medium">目標まで あと{Math.round(100 - (arr2035?.arr ?? 0))}億円</p>
              )}
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">2035年 推定管理車両数</p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{arr2035?.vehicles.toLocaleString() ?? '-'}台</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">現在比 {arr2035 ? Math.round((arr2035.vehicles / params.managedVehicles) * 100) : '-'}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">ARR成長曲線（2026-2035）</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projection} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}億`} />
                    <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${value}億円`, 'ARR']} />
                    <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '100億円目標', fill: '#ef4444', fontSize: 11 }} />
                    <Area type="monotone" dataKey="arr" stroke="#3b82f6" strokeWidth={2} fill="url(#simGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5 space-y-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">パラメーター調整</h3>
              <SliderInput label="管理車両台数" value={params.managedVehicles} min={50000} max={500000} step={5000} unit="台" onChange={update('managedVehicles')} />
              <SliderInput label="顧客数" value={params.customers} min={5000} max={100000} step={1000} unit="社" onChange={update('customers')} />
              <SliderInput label="月次純増" value={params.monthlyNetNew} min={10} max={500} step={5} unit="社/月" onChange={update('monthlyNetNew')} />
              <SliderInput label="ARPU（年間）" value={params.arpu} min={10} max={100} step={1} unit="万円" onChange={update('arpu')} />
              <SliderInput label="チャーン率" value={params.churnRate} min={0} max={5} step={0.1} unit="%" onChange={update('churnRate')} />
              <button onClick={() => setParams({ ...DEFAULT_SIMULATOR_PARAMS })}
                className="w-full text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] transition-all mt-2">
                リセット
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: 'green' | 'yellow' | 'red' }) {
  const border = highlight === 'green' ? 'border-emerald-500/20 bg-emerald-500/5' :
    highlight === 'red' ? 'border-red-500/20 bg-red-500/5' :
    highlight === 'yellow' ? 'border-amber-500/20 bg-amber-500/5' :
    'border-[var(--border)] bg-[var(--card-bg)]';
  const subColor = highlight === 'green' ? 'text-emerald-400' :
    highlight === 'red' ? 'text-red-400' :
    highlight === 'yellow' ? 'text-amber-400' :
    'text-[var(--text-tertiary)]';
  return (
    <div className={`rounded-xl p-4 border shadow-[var(--shadow-card)] ${border}`}>
      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

function PillarCard({ title, items, color }: { title: string; items: string[]; color: 'blue' | 'purple' | 'cyan' }) {
  const colors = {
    blue: 'border-blue-500/20 bg-blue-500/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
  };
  const dotColors = { blue: 'bg-blue-400', purple: 'bg-purple-400', cyan: 'bg-cyan-400' };
  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${dotColors[color]} mt-1 shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
