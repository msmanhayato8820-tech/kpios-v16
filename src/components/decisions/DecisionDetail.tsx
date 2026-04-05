'use client';

import { Decision, Priority } from '@/types';
import OptionCompare from './OptionCompare';

const PRIORITY_COLORS: Record<Priority, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-gray-400 bg-gray-500/15' },
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/15' },
  in_progress: { label: 'In Progress', color: 'text-blue-400 bg-blue-500/15' },
  done: { label: 'Done', color: 'text-green-400 bg-green-500/15' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/15' },
};

const OUTCOME_LABELS: Record<string, { label: string; color: string }> = {
  success: { label: '成功', color: 'text-green-400 bg-green-500/15' },
  partial: { label: '部分的', color: 'text-yellow-400 bg-yellow-500/15' },
  failure: { label: '失敗', color: 'text-red-400 bg-red-500/15' },
  pending: { label: '評価待ち', color: 'text-gray-400 bg-gray-500/15' },
};

interface Props {
  decision: Decision;
  onBack: () => void;
}

export default function DecisionDetail({ decision: d, onBack }: Props) {
  const statusInfo = STATUS_LABELS[d.status];

  // Timeline steps
  const timelineSteps = [
    { label: '起案', date: d.date, done: true },
    { label: '議論・分析', date: null, done: d.status !== 'draft' },
    { label: '決定', date: d.decided_at ?? null, done: d.selected_option !== undefined },
    { label: '実行', date: null, done: d.status === 'in_progress' || d.status === 'done' },
    { label: '振り返り', date: null, done: !!d.outcome },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs text-[var(--text-tertiary)]">{d.id}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PRIORITY_COLORS[d.priority]}`}>
              {d.priority}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{d.title}</h2>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Timeline</h3>
        <div className="flex items-center gap-0">
          {timelineSteps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute top-3 right-1/2 w-full h-0.5 ${step.done ? 'bg-blue-500' : 'bg-[var(--border)]'}`} />
              )}
              <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step.done
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--border)] text-[var(--text-tertiary)]'
              }`}>
                {step.done ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)] mt-1 text-center">{step.label}</span>
              {step.date && <span className="text-[9px] text-[var(--text-tertiary)]">{step.date}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Context */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">背景・コンテキスト</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{d.context}</p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetaCard label="オーナー" value={d.owner} />
        <MetaCard label="期限" value={d.due_date} highlight={new Date(d.due_date) < new Date() && d.status !== 'done'} />
        <MetaCard label="カテゴリ" value={d.category} />
        <MetaCard label="インパクト" value={d.impact_level} />
      </div>

      {/* Stakeholders */}
      {d.stakeholders.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
          <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">ステークホルダー</h3>
          <div className="flex flex-wrap gap-1.5">
            {d.stakeholders.map((s) => (
              <span key={s} className="text-xs px-2 py-1 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {d.risks.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
          <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">リスク要因</h3>
          <ul className="space-y-1">
            {d.risks.map((r, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <svg className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Option Comparison */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
        <OptionCompare options={d.options} selectedOption={d.selected_option} readonly />
      </div>

      {/* Decision Rationale */}
      {d.decision_rationale && (
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">決定理由</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{d.decision_rationale}</p>
        </div>
      )}

      {/* Outcome */}
      {d.outcome && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">結果・振り返り</h3>
            {d.outcome_evaluation && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${OUTCOME_LABELS[d.outcome_evaluation].color}`}>
                {OUTCOME_LABELS[d.outcome_evaluation].label}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{d.outcome}</p>
        </div>
      )}

      {/* Linked KPIs & Actions */}
      {(d.linked_kpis.length > 0 || d.linked_actions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {d.linked_kpis.length > 0 && (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">関連KPI</h3>
              <div className="flex flex-wrap gap-1.5">
                {d.linked_kpis.map((k) => (
                  <span key={k} className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-mono">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {d.linked_actions.length > 0 && (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">関連アクション</h3>
              <div className="flex flex-wrap gap-1.5">
                {d.linked_actions.map((a) => (
                  <span key={a} className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetaCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>{value}</p>
    </div>
  );
}
