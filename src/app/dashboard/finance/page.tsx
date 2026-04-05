'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Line, ComposedChart, Cell,
  PieChart, Pie,
} from 'recharts';
import { MONTHLY_FINANCE, PAYMENT_ALERTS, COST_BREAKDOWN } from '@/data/mock';
import { PaymentStatus } from '@/types';

type Tab = 'overview' | 'cost' | 'payments';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; border: string }> = {
  paid: { label: '入金済', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  upcoming: { label: '入金予定', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  overdue: { label: '延滞', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  partial: { label: '一部入金', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

export default function FinancePage() {
  const [tab, setTab] = useState<Tab>('overview');

  // Summaries
  const ytdActual = MONTHLY_FINANCE.filter(m => m.revenueActual !== null);
  const ytdRevenue = ytdActual.reduce((s, m) => s + (m.revenueActual ?? 0), 0);
  const ytdRevenuePlan = ytdActual.reduce((s, m) => s + m.revenuePlan, 0);
  const ytdCost = ytdActual.reduce((s, m) => s + (m.costActual ?? 0), 0);
  const ytdCostPlan = ytdActual.reduce((s, m) => s + m.costPlan, 0);
  const ytdProfit = ytdRevenue - ytdCost;
  const ytdProfitPlan = ytdRevenuePlan - ytdCostPlan;

  const annualRevenueForecast = MONTHLY_FINANCE.reduce((s, m) => s + m.revenueForecast, 0);
  const annualRevenuePlan = MONTHLY_FINANCE.reduce((s, m) => s + m.revenuePlan, 0);
  const annualProfitForecast = MONTHLY_FINANCE.reduce((s, m) => s + m.profitForecast, 0);
  const annualProfitPlan = MONTHLY_FINANCE.reduce((s, m) => s + m.profitPlan, 0);

  const overdueTotal = PAYMENT_ALERTS.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const upcomingTotal = PAYMENT_ALERTS.filter(p => p.status === 'upcoming').reduce((s, p) => s + p.amount, 0);

  // Chart data
  const revenueChartData = MONTHLY_FINANCE.map(m => ({
    label: m.label,
    計画: m.revenuePlan / 100,
    実績: m.revenueActual ? m.revenueActual / 100 : null,
    見込み: m.revenueActual === null ? m.revenueForecast / 100 : null,
  }));

  const profitChartData = MONTHLY_FINANCE.map(m => ({
    label: m.label,
    利益計画: m.profitPlan / 100,
    利益実績: m.profitActual ? m.profitActual / 100 : null,
    利益見込み: m.profitActual === null ? m.profitForecast / 100 : null,
  }));

  const costPieData = COST_BREAKDOWN.map(c => ({
    name: c.category,
    value: c.actual,
    color: c.color,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finance Dashboard</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
          売上/コスト計画・見込み実績・入金アラート
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Mock Data — MoneyForward連携予定
          </span>
        </p>
      </div>

      {/* Tab Switch */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        {([
          { id: 'overview' as const, label: '売上・利益概況' },
          { id: 'cost' as const, label: 'コスト分析' },
          { id: 'payments' as const, label: '入金アラート' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              tab === t.id ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== Overview Tab ===== */}
      {tab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              label="YTD 売上実績"
              value={`${(ytdRevenue / 10000).toFixed(1)}億円`}
              sub={`計画比 ${((ytdRevenue / ytdRevenuePlan) * 100).toFixed(1)}%`}
              highlight={ytdRevenue >= ytdRevenuePlan ? 'green' : 'yellow'}
            />
            <SummaryCard
              label="YTD 営業利益"
              value={`${(ytdProfit / 10000).toFixed(1)}億円`}
              sub={`計画比 ${((ytdProfit / ytdProfitPlan) * 100).toFixed(1)}%`}
              highlight={ytdProfit >= ytdProfitPlan ? 'green' : 'yellow'}
            />
            <SummaryCard
              label="通期売上見込み"
              value={`${(annualRevenueForecast / 10000).toFixed(1)}億円`}
              sub={`計画 ${(annualRevenuePlan / 10000).toFixed(1)}億 (${((annualRevenueForecast / annualRevenuePlan) * 100).toFixed(0)}%)`}
              highlight={annualRevenueForecast >= annualRevenuePlan ? 'green' : 'red'}
            />
            <SummaryCard
              label="延滞入金"
              value={`${(overdueTotal / 10000).toFixed(2)}億円`}
              sub={`${PAYMENT_ALERTS.filter(p => p.status === 'overdue').length}件 要対応`}
              highlight={overdueTotal > 0 ? 'red' : 'green'}
            />
          </div>

          {/* Revenue Chart */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">月次売上 — 計画 vs 実績 vs 見込み（百万円）</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
                    formatter={(value) => value != null ? [`${Number(value).toFixed(0)}百万円`] : ['-']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="計画" fill="#6b7280" fillOpacity={0.3} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="実績" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="見込み" fill="#8b5cf6" fillOpacity={0.5} radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">月次営業利益 — 計画 vs 実績 vs 見込み（百万円）</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={profitChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
                    formatter={(value) => value != null ? [`${Number(value).toFixed(0)}百万円`] : ['-']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="利益計画" fill="#6b7280" fillOpacity={0.3} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="利益実績" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="利益見込み" fill="#14b8a6" fillOpacity={0.5} radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">月次詳細（万円）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">月</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">売上計画</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">売上実績/見込</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">差異</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">コスト計画</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">コスト実績/見込</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">利益</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_FINANCE.map(m => {
                    const rev = m.revenueActual ?? m.revenueForecast;
                    const cost = m.costActual ?? m.costForecast;
                    const diff = rev - m.revenuePlan;
                    const profit = rev - cost;
                    const isActual = m.revenueActual !== null;
                    return (
                      <tr key={m.month} className="border-b border-[var(--border)]">
                        <td className="py-2 px-2 text-[var(--text-primary)]">{m.label}</td>
                        <td className="text-right py-2 px-2 text-[var(--text-secondary)]">{m.revenuePlan.toLocaleString()}</td>
                        <td className={`text-right py-2 px-2 ${isActual ? 'text-[var(--text-primary)] font-medium' : 'text-purple-400 italic'}`}>
                          {rev.toLocaleString()}{!isActual && ' *'}
                        </td>
                        <td className={`text-right py-2 px-2 font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {diff >= 0 ? '+' : ''}{diff.toLocaleString()}
                        </td>
                        <td className="text-right py-2 px-2 text-[var(--text-secondary)]">{m.costPlan.toLocaleString()}</td>
                        <td className={`text-right py-2 px-2 ${isActual ? 'text-[var(--text-primary)]' : 'text-purple-400 italic'}`}>
                          {cost.toLocaleString()}{!isActual && ' *'}
                        </td>
                        <td className={`text-right py-2 px-2 font-medium ${profit >= m.profitPlan ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {profit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold">
                    <td className="py-2 px-2 text-[var(--text-primary)]">合計</td>
                    <td className="text-right py-2 px-2 text-[var(--text-secondary)]">{annualRevenuePlan.toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-[var(--text-primary)]">{annualRevenueForecast.toLocaleString()}</td>
                    <td className={`text-right py-2 px-2 ${annualRevenueForecast - annualRevenuePlan >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {annualRevenueForecast - annualRevenuePlan >= 0 ? '+' : ''}{(annualRevenueForecast - annualRevenuePlan).toLocaleString()}
                    </td>
                    <td className="text-right py-2 px-2 text-[var(--text-secondary)]">
                      {MONTHLY_FINANCE.reduce((s, m) => s + m.costPlan, 0).toLocaleString()}
                    </td>
                    <td className="text-right py-2 px-2 text-[var(--text-primary)]">
                      {MONTHLY_FINANCE.reduce((s, m) => s + m.costForecast, 0).toLocaleString()}
                    </td>
                    <td className="text-right py-2 px-2 text-emerald-400">
                      {annualProfitForecast.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-2">* 紫字イタリック = 見込み値（未確定）</p>
            </div>
          </div>
        </>
      )}

      {/* ===== Cost Tab ===== */}
      {tab === 'cost' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              label="YTD コスト実績"
              value={`${(ytdCost / 10000).toFixed(1)}億円`}
              sub={`計画比 ${((ytdCost / ytdCostPlan) * 100).toFixed(1)}%`}
              highlight={ytdCost <= ytdCostPlan ? 'green' : 'red'}
            />
            <SummaryCard
              label="営業利益率(YTD)"
              value={`${((ytdProfit / ytdRevenue) * 100).toFixed(1)}%`}
              sub={`計画 ${((ytdProfitPlan / ytdRevenuePlan) * 100).toFixed(1)}%`}
              highlight={(ytdProfit / ytdRevenue) >= (ytdProfitPlan / ytdRevenuePlan) ? 'green' : 'yellow'}
            />
            <SummaryCard
              label="最大コスト項目"
              value="人件費"
              sub={`${COST_BREAKDOWN[0].actual.toLocaleString()}万円/月`}
            />
            <SummaryCard
              label="コスト超過項目"
              value={`${COST_BREAKDOWN.filter(c => c.actual > c.plan).length}件`}
              sub={COST_BREAKDOWN.filter(c => c.actual > c.plan).map(c => c.category).join(', ') || 'なし'}
              highlight={COST_BREAKDOWN.filter(c => c.actual > c.plan).length > 0 ? 'yellow' : 'green'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Pie Chart */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">コスト構成比（直近月実績）</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costPieData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {costPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
                      formatter={(value) => [`${Number(value).toLocaleString()}万円`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Plan vs Actual Bar */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">コスト項目別 計画 vs 実績（万円）</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={COST_BREAKDOWN.map(c => ({ category: c.category, 計画: c.plan, 実績: c.actual }))} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} width={80} />
                    <Tooltip
                      contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
                      formatter={(value) => [`${Number(value).toLocaleString()}万円`]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="計画" fill="#6b7280" fillOpacity={0.4} barSize={12} radius={[0, 2, 2, 0]} />
                    <Bar dataKey="実績" fill="#3b82f6" barSize={12} radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cost Detail Table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">コスト明細（直近月）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">カテゴリ</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">計画</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">実績</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">差異</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">達成率</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_BREAKDOWN.map(c => {
                    const diff = c.actual - c.plan;
                    const rate = (c.actual / c.plan) * 100;
                    return (
                      <tr key={c.category} className="border-b border-[var(--border)]">
                        <td className="py-2 px-2 text-[var(--text-primary)]">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                            {c.category}
                          </div>
                        </td>
                        <td className="text-right py-2 px-2 text-[var(--text-secondary)]">{c.plan.toLocaleString()}万</td>
                        <td className="text-right py-2 px-2 text-[var(--text-primary)] font-medium">{c.actual.toLocaleString()}万</td>
                        <td className={`text-right py-2 px-2 font-medium ${diff <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {diff > 0 ? '+' : ''}{diff.toLocaleString()}万
                        </td>
                        <td className={`text-right py-2 px-2 font-medium ${rate <= 100 ? 'text-emerald-400' : rate <= 110 ? 'text-amber-400' : 'text-red-400'}`}>
                          {rate.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold">
                    <td className="py-2 px-2 text-[var(--text-primary)]">合計</td>
                    <td className="text-right py-2 px-2 text-[var(--text-secondary)]">{COST_BREAKDOWN.reduce((s, c) => s + c.plan, 0).toLocaleString()}万</td>
                    <td className="text-right py-2 px-2 text-[var(--text-primary)]">{COST_BREAKDOWN.reduce((s, c) => s + c.actual, 0).toLocaleString()}万</td>
                    <td className={`text-right py-2 px-2 ${
                      COST_BREAKDOWN.reduce((s, c) => s + c.actual, 0) <= COST_BREAKDOWN.reduce((s, c) => s + c.plan, 0) ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(COST_BREAKDOWN.reduce((s, c) => s + c.actual, 0) - COST_BREAKDOWN.reduce((s, c) => s + c.plan, 0)) > 0 ? '+' : ''}
                      {(COST_BREAKDOWN.reduce((s, c) => s + c.actual, 0) - COST_BREAKDOWN.reduce((s, c) => s + c.plan, 0)).toLocaleString()}万
                    </td>
                    <td className="text-right py-2 px-2 text-[var(--text-primary)]">
                      {((COST_BREAKDOWN.reduce((s, c) => s + c.actual, 0) / COST_BREAKDOWN.reduce((s, c) => s + c.plan, 0)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===== Payments Tab ===== */}
      {tab === 'payments' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              label="延滞 合計"
              value={`${overdueTotal.toLocaleString()}万円`}
              sub={`${PAYMENT_ALERTS.filter(p => p.status === 'overdue').length}件`}
              highlight={overdueTotal > 0 ? 'red' : 'green'}
            />
            <SummaryCard
              label="一部入金"
              value={`${PAYMENT_ALERTS.filter(p => p.status === 'partial').reduce((s, p) => s + p.amount, 0).toLocaleString()}万円`}
              sub={`${PAYMENT_ALERTS.filter(p => p.status === 'partial').length}件`}
              highlight="yellow"
            />
            <SummaryCard
              label="入金予定（30日以内）"
              value={`${upcomingTotal.toLocaleString()}万円`}
              sub={`${PAYMENT_ALERTS.filter(p => p.status === 'upcoming').length}件`}
            />
            <SummaryCard
              label="入金済（直近）"
              value={`${PAYMENT_ALERTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}万円`}
              sub={`${PAYMENT_ALERTS.filter(p => p.status === 'paid').length}件`}
              highlight="green"
            />
          </div>

          {/* Overdue Alert Banner */}
          {overdueTotal > 0 && (
            <div className="rounded-xl p-4 border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-400">延滞入金アラート</h4>
                  <p className="text-xs text-red-300/80 mt-0.5">
                    {PAYMENT_ALERTS.filter(p => p.status === 'overdue').length}件・合計{overdueTotal.toLocaleString()}万円が入金期限を超過しています。経理チームへの確認を推奨します。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment List */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">入金一覧</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">ステータス</th>
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">取引先</th>
                    <th className="text-right py-2 px-2 text-[var(--text-tertiary)] font-medium">金額</th>
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">期日</th>
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">請求書No</th>
                    <th className="text-left py-2 px-2 text-[var(--text-tertiary)] font-medium">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {[...PAYMENT_ALERTS]
                    .sort((a, b) => {
                      const order: Record<PaymentStatus, number> = { overdue: 0, partial: 1, upcoming: 2, paid: 3 };
                      return order[a.status] - order[b.status];
                    })
                    .map(p => {
                      const cfg = STATUS_CONFIG[p.status];
                      return (
                        <tr key={p.id} className={`border-b border-[var(--border)] ${p.status === 'overdue' ? 'bg-red-500/[0.02]' : ''}`}>
                          <td className="py-2.5 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.border} ${cfg.color} border`}>
                              {cfg.label}
                              {p.daysPastDue && <span className="ml-1">({p.daysPastDue}日)</span>}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-[var(--text-primary)] font-medium">{p.customer}</td>
                          <td className="text-right py-2.5 px-2 text-[var(--text-primary)] font-semibold">{p.amount.toLocaleString()}万円</td>
                          <td className="py-2.5 px-2 text-[var(--text-secondary)]">{p.dueDate}</td>
                          <td className="py-2.5 px-2 text-[var(--text-tertiary)]">{p.invoiceNo}</td>
                          <td className="py-2.5 px-2 text-[var(--text-tertiary)] max-w-[200px] truncate">{p.note ?? '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MoneyForward Integration Note */}
          <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07a4.5 4.5 0 016.364 6.364l-4.5 4.5a4.5 4.5 0 01-7.244-1.242" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-400">MoneyForward連携について</h4>
                <p className="text-xs text-blue-300/70 mt-0.5 leading-relaxed">
                  現在はモックデータで動作中です。本番環境ではMoneyForward クラウド請求書APIと連携し、リアルタイムの入金状況・売上データを自動取得する設計になっています。
                  API連携にはMoneyForward法人プランのAPIキーが必要です。
                </p>
              </div>
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
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}
