'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ARR_HISTORY } from '@/data/mock';

export default function ArrChart() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">ARR推移（直近12ヶ月）</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ARR_HISTORY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}億`} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }} labelStyle={{ color: 'var(--text-tertiary)' }} formatter={(value) => [`${value}億円`, 'ARR']} />
            <Area type="monotone" dataKey="arr" stroke="#3b82f6" strokeWidth={2} fill="url(#arrGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
