export type KpiStatus = 'good' | 'warning' | 'risk';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionPriority = 'P0' | 'P1' | 'P2';
export type ActionStatus = '未着手' | '実行中' | '完了';
export type UserRole = 'CEO' | 'CFO' | 'Sales' | 'CS' | 'HR' | 'Ops' | 'Product' | 'Marketing' | 'Board';

export interface KpiDefinition {
  numerator: string;
  denominator: string;
  scope: string;
  note: string;
  source: string;
  refresh_cycle: string;
}

export interface Kpi {
  api_key: string;
  name: string;
  category: string;
  value: number | null;
  target: number;
  unit: string;
  status: KpiStatus;
  mom_change: string;
  trigger_fired?: boolean;
  is_displayed_in: string[];
  is_north_star?: boolean;
  is_growth_driver?: boolean;
  priority?: Priority;
  owner?: string;
  due_date?: string;
  next_action?: string;
  linked_kpi?: string[];
  depends_on?: string[];
  definition: KpiDefinition;
  confidence: string;
  last_updated_at?: string;
  subcategory?: string;
}

export interface Action {
  name: string;
  priority: ActionPriority;
  status: ActionStatus;
  owner: string;
  deadline: string;
  impact: string;
  trigger_kpi: string;
  trigger_condition: string[];
  reason: string;
  last_updated_at?: string;
}

export interface Decision {
  title: string;
  date: string;
  priority: Priority;
  status: 'pending' | 'in_progress' | 'done';
  impact: string;
  impact_level: Priority;
  owner: string;
  due_date: string;
  category: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface SimulatorParams {
  managedVehicles: number;
  customers: number;
  monthlyNetNew: number;
  arpu: number;
  growthRate: number;
  churnRate: number;
}
