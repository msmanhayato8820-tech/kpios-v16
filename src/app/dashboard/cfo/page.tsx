'use client';

import DashboardPage from '@/components/DashboardPage';
import ArrChart from '@/components/ArrChart';
import { CFO_KPIS } from '@/data/mock';

export default function CfoDashboard() {
  return (
    <DashboardPage title="CFO Dashboard" subtitle="ファイナンス・キャッシュフロー" kpis={CFO_KPIS}>
      <ArrChart />
    </DashboardPage>
  );
}
