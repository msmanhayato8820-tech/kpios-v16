'use client';

import { Action } from '@/types';

export default function ActionProgressChart({ actions }: { actions: Action[] }) {
  const total = actions.length;
  const completed = actions.filter((a) => a.status === '完了').length;
  const inProgress = actions.filter((a) => a.status === '実行中').length;
  const notStarted = actions.filter((a) => a.status === '未着手').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressRate = total > 0 ? Math.round(((completed + inProgress) / total) * 100) : 0;

  const r = 40;
  const circumference = 2 * Math.PI * r;
  const completedOffset = circumference - (completed / total) * circumference;
  const inProgressOffset = circumference - ((completed + inProgress) / total) * circumference;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">アクション進捗</h3>
      <div className="flex items-center gap-6">
        {/* Ring Chart */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--hover-bg)" strokeWidth="8" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f59e0b" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={inProgressOffset}
              className="transition-all duration-500" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="#10b981" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={completedOffset}
              className="transition-all duration-500" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[var(--text-primary)]">{progressRate}%</span>
            <span className="text-[9px] text-[var(--text-tertiary)]">着手率</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-[var(--text-secondary)]">完了</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{completed}/{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-[var(--text-secondary)]">実行中</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{inProgress}/{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-secondary)]">未着手</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{notStarted}/{total}</span>
          </div>
          {/* Overdue */}
          {actions.filter(a => a.status !== '完了' && new Date(a.deadline) < new Date()).length > 0 && (
            <div className="pt-1.5 border-t border-[var(--border)]">
              <span className="text-[10px] text-red-400 font-medium">
                {actions.filter(a => a.status !== '完了' && new Date(a.deadline) < new Date()).length}件が期限超過
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
