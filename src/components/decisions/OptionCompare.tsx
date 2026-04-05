'use client';

import { DecisionOption, Priority } from '@/types';

const RISK_COLORS: Record<Priority, string> = {
  CRITICAL: 'text-red-400 bg-red-500/15',
  HIGH: 'text-orange-400 bg-orange-500/15',
  MEDIUM: 'text-yellow-400 bg-yellow-500/15',
  LOW: 'text-green-400 bg-green-500/15',
};

interface Props {
  options: DecisionOption[];
  selectedOption?: number;
  onSelect?: (index: number) => void;
  readonly?: boolean;
}

export default function OptionCompare({ options, selectedOption, onSelect, readonly }: Props) {
  if (options.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--text-tertiary)]">
        選択肢が登録されていません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">選択肢比較</h3>
      <div className={`grid gap-3 ${options.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          return (
            <div
              key={i}
              className={`relative p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/20'
                  : 'border-[var(--border)] bg-[var(--card-bg)]'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</h4>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${RISK_COLORS[opt.risk_level]}`}>
                  Risk: {opt.risk_level}
                </span>
              </div>

              {/* Pros */}
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wider mb-1">Pros</p>
                <ul className="space-y-0.5">
                  {opt.pros.map((p, j) => (
                    <li key={j} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                      <span className="text-green-400 mt-0.5 shrink-0">+</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">Cons</p>
                <ul className="space-y-0.5">
                  {opt.cons.map((c, j) => (
                    <li key={j} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5 shrink-0">-</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact & Cost */}
              <div className="space-y-1 pt-2 border-t border-[var(--border)]">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Impact</span>
                  <span className="text-[var(--text-secondary)]">{opt.estimated_impact}</span>
                </div>
                {opt.cost && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">Cost</span>
                    <span className="text-[var(--text-secondary)]">{opt.cost}</span>
                  </div>
                )}
              </div>

              {/* Select button */}
              {!readonly && onSelect && !isSelected && (
                <button
                  onClick={() => onSelect(i)}
                  className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-all"
                >
                  この選択肢を採用
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
