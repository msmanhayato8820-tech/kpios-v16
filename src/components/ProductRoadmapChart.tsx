'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PRODUCT_ROADMAP, PRODUCT_LINES } from '@/data/mock';

export default function ProductRoadmapChart() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">サービス別 売上推移（100億宣言ロードマップ）</h3>
          <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">単位: 億円 / 2025年〜2035年</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <span className="text-[10px] font-bold text-blue-400">100億宣言</span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={PRODUCT_ROADMAP} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(v) => `${v}億`} />
            <Tooltip
              contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 12, fontSize: 12 }}
              formatter={(value, name) => [`${value}億円`, String(name)]}
              labelFormatter={(label) => `${label}年度`}
            />
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '100億円', fill: '#ef4444', fontSize: 11, position: 'right' }} />
            <Bar dataKey="GBC" stackId="a" fill={PRODUCT_LINES[0].color} radius={[0, 0, 0, 0]} name="GBC" />
            <Bar dataKey="GBCDR" stackId="a" fill={PRODUCT_LINES[1].color} name="GBCDR" />
            <Bar dataKey="BSS" stackId="a" fill={PRODUCT_LINES[2].color} name="BSS" />
            <Bar dataKey="BSSforALC" stackId="a" fill={PRODUCT_LINES[3].color} name="BSSforALC" />
            <Bar dataKey="新サービス" stackId="a" fill={PRODUCT_LINES[4].color} name="新サービス" />
            <Bar dataKey="新製品" stackId="a" fill={PRODUCT_LINES[5].color} radius={[4, 4, 0, 0]} name="新製品" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
        {PRODUCT_LINES.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
            <span className="text-[10px] text-[var(--text-secondary)]">{p.shortName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
