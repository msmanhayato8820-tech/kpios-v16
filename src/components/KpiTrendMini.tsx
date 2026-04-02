'use client';

import { KPI_TRENDS } from '@/data/mock';

export default function KpiTrendMini({ apiKey, status }: { apiKey: string; status: string }) {
  const data = KPI_TRENDS[apiKey];
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 16;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const color = status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-12 h-4 shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
