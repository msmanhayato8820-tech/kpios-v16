'use client';

import { Action } from '@/types';

const PRIORITY_STYLES = {
  P0: { bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500 text-white' },
  P1: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500 text-black' },
  P2: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', badge: 'bg-gray-600 text-white' },
};

const STATUS_BADGE = {
  '未着手': 'bg-gray-700 text-gray-300',
  '実行中': 'bg-blue-500/20 text-blue-400',
  '完了': 'bg-emerald-500/20 text-emerald-400',
};

export default function ActionAlert({ action }: { action: Action }) {
  const ps = PRIORITY_STYLES[action.priority];
  return (
    <div className={`${ps.bg} border ${ps.border} rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${ps.badge}`}>
          {action.priority}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-200 font-medium leading-snug">{action.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_BADGE[action.status]}`}>
              {action.status}
            </span>
            <span className="text-xs text-gray-500">{action.owner}</span>
            <span className="text-xs text-gray-600">期限: {action.deadline}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{action.reason}</p>
        </div>
      </div>
    </div>
  );
}
