'use client';

import { useState } from 'react';
import { STRATEGIC_GOALS, StrategicGoal } from '@/data/mock';

const STATUS_STYLES = {
  on_track: { label: '順調', color: 'text-emerald-400', bg: 'bg-emerald-500/15', bar: 'bg-emerald-500' },
  at_risk: { label: '注意', color: 'text-amber-400', bg: 'bg-amber-500/15', bar: 'bg-amber-500' },
  behind: { label: '遅延', color: 'text-red-400', bg: 'bg-red-500/15', bar: 'bg-red-500' },
};

function GoalDetail({ goal, onClose }: { goal: StrategicGoal; onClose: () => void }) {
  const ss = STATUS_STYLES[goal.status];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{goal.number}</span>
            <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug">{goal.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">進捗</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-md ${ss.bg} ${ss.color}`}>{ss.label}</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{goal.progress}%</span>
              </div>
            </div>
            <div className="h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${ss.bar} transition-all duration-700`} style={{ width: `${goal.progress}%` }} />
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">主要指標</h3>
            <div className="grid grid-cols-1 gap-2">
              {goal.keyMetrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-lg bg-[var(--hover-bg)] px-3 py-2">
                  <span className="text-xs text-[var(--text-secondary)]">{m.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{m.current}</span>
                    <span className="text-xs text-[var(--text-tertiary)] ml-2">/ {m.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <h3 className="text-sm font-medium text-red-400 mb-2">課題</h3>
            <ul className="space-y-1.5">
              {goal.challenges.map((c, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-2">
                  <span className="text-red-400 shrink-0">-</span>{c}
                </li>
              ))}
            </ul>
          </div>

          {/* Measures */}
          <div>
            <h3 className="text-sm font-medium text-blue-400 mb-2">具体的措置</h3>
            <ul className="space-y-1.5">
              {goal.measures.map((m, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-2">
                  <span className="text-blue-400 shrink-0">-</span>{m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StrategicGoals() {
  const [openGoal, setOpenGoal] = useState<StrategicGoal | null>(null);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">100</span>
        </div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">100億宣言 戦略目標</h3>
      </div>

      <div className="space-y-3">
        {STRATEGIC_GOALS.map((goal) => {
          const ss = STATUS_STYLES[goal.status];
          return (
            <div
              key={goal.id}
              onClick={() => setOpenGoal(goal)}
              className="rounded-xl border border-[var(--border)] p-4 cursor-pointer transition-all hover:border-[var(--border-strong)] hover:bg-[var(--card-bg-hover)] group"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                  {goal.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] leading-snug">{goal.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${ss.bg} ${ss.color}`}>{ss.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ss.bar} transition-all duration-500`} style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] w-8 text-right">{goal.progress}%</span>
                  </div>
                  {/* Key metrics preview */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {goal.keyMetrics.slice(0, 2).map((m) => (
                      <span key={m.label} className="text-[10px] text-[var(--text-tertiary)]">
                        {m.label}: <span className="text-[var(--text-secondary)]">{m.current}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {openGoal && <GoalDetail goal={openGoal} onClose={() => setOpenGoal(null)} />}
    </div>
  );
}
