'use client';

import { Action } from '@/types';

const PRIORITY_STYLES = {
  P0: { badge: 'bg-red-500 text-white' },
  P1: { badge: 'bg-amber-500 text-black' },
  P2: { badge: 'bg-[var(--hover-bg)] text-[var(--text-secondary)]' },
};

const STATUS_BADGE = {
  '未着手': 'bg-[var(--hover-bg)] text-[var(--text-tertiary)]',
  '実行中': 'bg-blue-500/15 text-blue-400',
  '完了': 'bg-emerald-500/15 text-emerald-400',
};

export default function ActionAlert({ action }: { action: Action }) {
  const ps = PRIORITY_STYLES[action.priority];
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-3 transition-all hover:border-[var(--border-strong)]">
      <div className="flex items-start gap-2.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 mt-0.5 ${ps.badge}`}>
          {action.priority}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">{action.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${STATUS_BADGE[action.status]}`}>
              {action.status}
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">{action.owner}</span>
            <span className="text-xs text-[var(--text-tertiary)]">期限: {action.deadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
