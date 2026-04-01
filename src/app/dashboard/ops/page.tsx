'use client';

import DashboardPage from '@/components/DashboardPage';
import { OPS_KPIS } from '@/data/mock';

export default function OpsDashboard() {
  return (
    <DashboardPage title="Ops Dashboard" subtitle="オペレーション・設置・サポート" kpis={OPS_KPIS} />
  );
}
