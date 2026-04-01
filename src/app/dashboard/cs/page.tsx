'use client';

import DashboardPage from '@/components/DashboardPage';
import { CS_KPIS } from '@/data/mock';

export default function CsDashboard() {
  const summary = '🔴 ハイリスク12社・SLA違反率8%・契約更新率88%が即時対応必須。今週の最優先: ハイリスク全社に個別レスキュープランを発動し、CSメンバーを担当に割り当て。';

  return (
    <DashboardPage title="CS Dashboard" subtitle="カスタマーサクセス" kpis={CS_KPIS}>
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <h3 className="text-sm font-medium text-amber-400 mb-2">CS部門サマリー</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
      </div>
    </DashboardPage>
  );
}
