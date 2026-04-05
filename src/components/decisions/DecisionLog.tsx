'use client';

import { Decision, Priority } from '@/types';

const OUTCOME_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  success: { label: '成功', color: 'text-green-400 bg-green-500/15', icon: 'M4.5 12.75l6 6 9-13.5' },
  partial: { label: '部分的', color: 'text-yellow-400 bg-yellow-500/15', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' },
  failure: { label: '失敗', color: 'text-red-400 bg-red-500/15', icon: 'M6 18L18 6M6 6l12 12' },
  pending: { label: '評価待ち', color: 'text-gray-400 bg-gray-500/15', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
};

const PRIORITY_DOT: Record<Priority, string> = {
  CRITICAL: 'bg-red-400',
  HIGH: 'bg-orange-400',
  MEDIUM: 'bg-yellow-400',
  LOW: 'bg-green-400',
};

interface Props {
  decisions: Decision[];
  onSelect: (d: Decision) => void;
}

export default function DecisionLog({ decisions, onSelect }: Props) {
  const completed = decisions
    .filter((d) => d.status === 'done' || d.status === 'cancelled')
    .sort((a, b) => (b.decided_at ?? b.date).localeCompare(a.decided_at ?? a.date));

  const stats = {
    total: completed.length,
    success: completed.filter((d) => d.outcome_evaluation === 'success').length,
    partial: completed.filter((d) => d.outcome_evaluation === 'partial').length,
    failure: completed.filter((d) => d.outcome_evaluation === 'failure').length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="完了" value={stats.total} color="text-[var(--text-primary)]" />
        <StatCard label="成功" value={stats.success} color="text-green-400" />
        <StatCard label="部分的" value={stats.partial} color="text-yellow-400" />
        <StatCard label="失敗" value={stats.failure} color="text-red-400" />
      </div>

      {/* Log List */}
      <div className="space-y-2">
        {completed.length === 0 ? (
          <div className="text-center py-12 text-sm text-[var(--text-tertiary)]">
            完了した意思決定はまだありません
          </div>
        ) : (
          completed.map((d) => {
            const outcome = d.outcome_evaluation ? OUTCOME_CONFIG[d.outcome_evaluation] : null;
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d)}
                className="w-full text-left p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] hover:border-[var(--border-strong)] transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[d.priority]}`} />
                      <span className="text-xs text-[var(--text-tertiary)]">{d.id}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{d.decided_at ?? d.date}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                      {d.title}
                    </p>
                    {d.selected_option !== undefined && d.options[d.selected_option] && (
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        採用: {d.options[d.selected_option].label}
                      </p>
                    )}
                    {d.outcome && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{d.outcome}</p>
                    )}
                  </div>
                  {outcome && (
                    <span className={`shrink-0 text-[10px] px-2 py-1 rounded font-medium ${outcome.color}`}>
                      {outcome.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{label}</p>
    </div>
  );
}
