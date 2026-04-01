'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardPage from '@/components/DashboardPage';
import { HR_KPIS, DEPT_BREAKDOWN } from '@/data/mock';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#64748b'];

export default function HrDashboard() {
  return (
    <DashboardPage title="HR Dashboard" subtitle="人事・採用・組織" kpis={HR_KPIS}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">部門別人員構成</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_BREAKDOWN} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${value}名`, '人数']} />
                <Bar dataKey="headcount" radius={[6, 6, 0, 0]}>
                  {DEPT_BREAKDOWN.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">部門別生産性（万円/月/人）</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_BREAKDOWN} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}万`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} width={60} />
                <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${value}万円/月/人`, '生産性']} />
                <Bar dataKey="productivity" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
