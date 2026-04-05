'use client';

import { Decision, DecisionStatus, Priority } from '@/types';

const STATUS_COLUMNS: { key: DecisionStatus; label: string; color: string }[] = [
  { key: 'draft', label: 'Draft', color: 'text-gray-400' },
  { key: 'pending', label: 'Pending', color: 'text-yellow-400' },
  { key: 'in_progress', label: 'In Progress', color: 'text-blue-400' },
  { key: 'done', label: 'Done', color: 'text-green-400' },
  { key: 'cancelled', label: 'Cancelled', color: 'text-red-400' },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const CATEGORY_COLORS: Record<string, string> = {
  Finance: 'bg-blue-500/15 text-blue-400',
  CS: 'bg-purple-500/15 text-purple-400',
  Sales: 'bg-green-500/15 text-green-400',
  Product: 'bg-cyan-500/15 text-cyan-400',
  HR: 'bg-pink-500/15 text-pink-400',
  Ops: 'bg-orange-500/15 text-orange-400',
};

interface Props {
  decisions: Decision[];
  onSelect: (d: Decision) => void;
  filterPriority: Priority | 'ALL';
  filterCategory: string;
  onFilterPriority: (p: Priority | 'ALL') => void;
  onFilterCategory: (c: string) => void;
}

export default function DecisionBoard({
  decisions,
  onSelect,
  filterPriority,
  filterCategory,
  onFilterPriority,
  onFilterCategory,
}: Props) {
  const filtered = decisions.filter((d) => {
    if (filterPriority !== 'ALL' && d.priority !== filterPriority) return false;
    if (filterCategory && filterCategory !== 'ALL' && d.category !== filterCategory) return false;
    return true;
  });

  const categories = ['ALL', ...Array.from(new Set(decisions.map((d) => d.category)))];

  const isOverdue = (d: Decision) => {
    if (d.status === 'done' || d.status === 'cancelled') return false;
    return new Date(d.due_date) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[var(--text-tertiary)] shrink-0">Priority:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onFilterPriority(p)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                filterPriority === p
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[var(--text-tertiary)] shrink-0">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onFilterCategory(c)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                filterCategory === c
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto -mx-1 px-1">
      <div className="grid grid-cols-5 gap-3 min-w-[640px]">
        {STATUS_COLUMNS.map((col) => {
          const items = filtered.filter((d) => d.status === col.key);
          return (
            <div key={col.key} className="space-y-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs text-[var(--text-tertiary)] bg-[var(--hover-bg)] px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {items.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelect(d)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] hover:border-[var(--border-strong)] transition-all group"
                  >
                    {isOverdue(d) && (
                      <div className="text-[10px] font-medium text-red-400 mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        期限超過
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium ${PRIORITY_COLORS[d.priority]}`}>
                        {d.priority}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[d.category] ?? 'bg-gray-500/15 text-gray-400'}`}>
                        {d.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug mb-2 group-hover:text-blue-400 transition-colors">
                      {d.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
                      <span>{d.owner}</span>
                      <span>{d.due_date}</span>
                    </div>
                    {d.options.length > 0 && (
                      <div className="mt-1.5 text-[10px] text-[var(--text-tertiary)]">
                        {d.selected_option !== undefined
                          ? `決定済: ${d.options[d.selected_option].label}`
                          : `${d.options.length}件の選択肢`}
                      </div>
                    )}
                  </button>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-6 text-xs text-[var(--text-tertiary)]">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
