'use client';

import { useState } from 'react';
import { Decision, Priority } from '@/types';
import { KEY_DECISIONS } from '@/data/mock';
import DecisionBoard from '@/components/decisions/DecisionBoard';
import DecisionDetail from '@/components/decisions/DecisionDetail';
import DecisionLog from '@/components/decisions/DecisionLog';

type Tab = 'board' | 'log';

export default function DecisionHubPage() {
  const [tab, setTab] = useState<Tab>('board');
  const [selected, setSelected] = useState<Decision | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const pendingCount = KEY_DECISIONS.filter((d) => d.status === 'pending' || d.status === 'draft').length;
  const overdueCount = KEY_DECISIONS.filter(
    (d) => d.status !== 'done' && d.status !== 'cancelled' && new Date(d.due_date) < new Date()
  ).length;

  if (selected) {
    return <DecisionDetail decision={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Decision Hub</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            意思決定の記録・判断支援・振り返り
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-medium text-yellow-400">{pendingCount}件 要判断</span>
            </div>
          )}
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="text-xs font-medium text-red-400">{overdueCount}件 期限超過</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <SummaryCard label="Draft" count={KEY_DECISIONS.filter((d) => d.status === 'draft').length} color="text-gray-400" />
        <SummaryCard label="Pending" count={KEY_DECISIONS.filter((d) => d.status === 'pending').length} color="text-yellow-400" />
        <SummaryCard label="In Progress" count={KEY_DECISIONS.filter((d) => d.status === 'in_progress').length} color="text-blue-400" />
        <SummaryCard label="Done" count={KEY_DECISIONS.filter((d) => d.status === 'done').length} color="text-green-400" />
        <SummaryCard label="Total" count={KEY_DECISIONS.length} color="text-[var(--text-primary)]" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        <TabButton active={tab === 'board'} onClick={() => setTab('board')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Board
        </TabButton>
        <TabButton active={tab === 'log'} onClick={() => setTab('log')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          Log
        </TabButton>
      </div>

      {/* Content */}
      {tab === 'board' && (
        <DecisionBoard
          decisions={KEY_DECISIONS}
          onSelect={setSelected}
          filterPriority={filterPriority}
          filterCategory={filterCategory}
          onFilterPriority={setFilterPriority}
          onFilterCategory={setFilterCategory}
        />
      )}
      {tab === 'log' && <DecisionLog decisions={KEY_DECISIONS} onSelect={setSelected} />}
    </div>
  );
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
      <p className={`text-xl font-bold ${color}`}>{count}</p>
      <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{label}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
        active
          ? 'border-blue-500 text-blue-500'
          : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
      }`}
    >
      {children}
    </button>
  );
}
