'use client';

import { useState } from 'react';
import { Kpi } from '@/types';

export default function ExportButton({ kpis, title }: { kpis: Kpi[]; title: string }) {
  const [open, setOpen] = useState(false);

  const exportCsv = () => {
    const headers = ['KPI名', '現在値', '目標', '単位', 'ステータス', '前月比', 'カテゴリ', '担当', '更新頻度'];
    const rows = kpis.map((k) => [
      k.name, String(k.value ?? ''), String(k.target), k.unit, k.status, k.mom_change, k.category, k.owner ?? '', k.definition.refresh_cycle,
    ]);
    const bom = '\uFEFF';
    const csv = bom + [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_KPI_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportPdf = () => {
    window.print();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)] transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        Export
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl z-50 p-1">
            <button onClick={exportCsv} className="w-full text-left px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg">
              CSV
            </button>
            <button onClick={exportPdf} className="w-full text-left px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg">
              PDF (Print)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
