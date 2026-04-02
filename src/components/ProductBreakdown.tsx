'use client';

import { PRODUCT_LINES } from '@/data/mock';

export default function ProductBreakdown() {
  const totalCurrent = PRODUCT_LINES.reduce((s, p) => s + p.currentArr, 0);
  const total2035 = PRODUCT_LINES.reduce((s, p) => s + p.targetArr2035, 0);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">プロダクトポートフォリオ</h3>
      <div className="space-y-3">
        {PRODUCT_LINES.map((p) => {
          const pctCurrent = (p.currentArr / totalCurrent) * 100;
          const pct2035 = (p.targetArr2035 / total2035) * 100;
          return (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                  <span className="text-xs font-medium text-[var(--text-primary)]">{p.shortName}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{p.description}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[var(--text-secondary)]">{p.currentArr}億</span>
                  <svg className="w-3 h-3 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-[var(--text-primary)] font-semibold">{p.targetArr2035}億</span>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pctCurrent}%`, background: p.color }} />
                </div>
                <span className="text-[9px] text-[var(--text-tertiary)] w-8 text-right">{Math.round(pctCurrent)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-tertiary)]">合計</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--text-secondary)]">{totalCurrent}億円</span>
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          <span className="text-[var(--text-primary)] font-bold">{total2035}億円</span>
        </div>
      </div>
    </div>
  );
}
