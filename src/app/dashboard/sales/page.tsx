'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardPage from '@/components/DashboardPage';
import { SALES_KPIS, MRR_BREAKDOWN } from '@/data/mock';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b'];

const FUNNEL_DATA = [
  { stage: 'リード', value: 200 },
  { stage: '商談化', value: 60 },
  { stage: '提案', value: 30 },
  { stage: '受注', value: 12 },
];

export default function SalesDashboard() {
  return (
    <DashboardPage title="Sales Dashboard" subtitle="営業・パイプライン" kpis={SALES_KPIS}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">MRR内訳（プロダクト別）</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MRR_BREAKDOWN} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v.toLocaleString()}万`} />
                <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${Number(value).toLocaleString()}万円`, 'MRR']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {MRR_BREAKDOWN.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">セールスファネル</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} width={60} />
                <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${value}件`, '']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
