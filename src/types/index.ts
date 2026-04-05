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

export type DecisionStatus = 'draft' | 'pending' | 'in_progress' | 'done' | 'cancelled';
export type OutcomeEvaluation = 'success' | 'partial' | 'failure' | 'pending';

export interface DecisionOption {
  label: string;
  pros: string[];
  cons: string[];
  estimated_impact: string;
  cost?: string;
  risk_level: Priority;
}

export interface Decision {
  id: string;
  title: string;
  date: string;
  priority: Priority;
  status: DecisionStatus;

  // 判断支援
  context: string;
  options: DecisionOption[];
  selected_option?: number;
  decision_rationale?: string;

  // リスク・インパクト
  impact: string;
  impact_level: Priority;
  risks: string[];

  // 責任・期限
  owner: string;
  stakeholders: string[];
  due_date: string;
  decided_at?: string;

  // 追跡
  category: string;
  linked_kpis: string[];
  linked_actions: string[];
  outcome?: string;
  outcome_evaluation?: OutcomeEvaluation;
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

// 100億宣言シミュレーター用
export interface SegmentParams {
  name: string;
  color: string;
  currentRevenue: number; // 現在の年間売上（億円）
  growthRate: number;     // 年間成長率（%）
  enabled: boolean;
}

export interface Hyaku10SimParams {
  segments: SegmentParams[];
  // 全社パラメーター
  headcount: number;
  revenuePerHead: number; // 1人あたり売上（万円）
  operatingMarginTarget: number; // 営業利益率目標（%）
}

// 財務ダッシュボード
export interface MonthlyFinance {
  month: string;       // '2026-01' etc.
  label: string;       // '1月' etc.
  revenuePlan: number; // 売上計画（万円）
  revenueActual: number | null; // 売上実績
  revenueForecast: number; // 売上見込み
  costPlan: number;    // コスト計画
  costActual: number | null; // コスト実績
  costForecast: number; // コスト見込み
  profitPlan: number;  // 利益計画
  profitActual: number | null; // 利益実績
  profitForecast: number; // 利益見込み
}

export type PaymentStatus = 'paid' | 'upcoming' | 'overdue' | 'partial';

export interface PaymentAlert {
  id: string;
  customer: string;
  amount: number;      // 万円
  dueDate: string;     // ISO date
  status: PaymentStatus;
  invoiceNo: string;
  daysPastDue?: number;
  note?: string;
}

export interface CostBreakdown {
  category: string;
  plan: number;        // 万円
  actual: number;      // 万円
  color: string;
}
