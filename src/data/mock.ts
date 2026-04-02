import { Kpi, Action, Decision, User } from '@/types';

export const MOCK_USERS: User[] = [
  { email: 'ceo@anest.co.jp', name: '尾田 専務', role: 'CEO' },
  { email: 'cfo@anest.co.jp', name: '財務部長', role: 'CFO' },
  { email: 'sales@anest.co.jp', name: '営業部長', role: 'Sales' },
  { email: 'cs@anest.co.jp', name: 'CS部長', role: 'CS' },
  { email: 'hr@anest.co.jp', name: 'HR部長', role: 'HR' },
  { email: 'ops@anest.co.jp', name: 'Ops部長', role: 'Ops' },
];

export const NORTH_STAR: Kpi = {
  api_key: 'arr_growth_rate',
  name: 'ARR成長率（North Star）',
  category: 'CEO',
  value: 35,
  target: 16,
  unit: '%',
  status: 'good',
  mom_change: '+2pt',
  is_displayed_in: ['CEO', 'Board'],
  is_north_star: true,
  confidence: 'high',
  definition: {
    numerator: '当期ARR − 前年同月ARR',
    denominator: '前年同月ARR',
    scope: 'PL',
    note: 'YoY成長率。North Star KPI。',
    source: 'monthly_pl',
    refresh_cycle: 'monthly',
  },
};

export const CEO_KPIS: Kpi[] = [
  {
    api_key: 'arr',
    name: '推定ARR',
    category: 'CEO',
    value: 27,
    target: 27,
    unit: '億円',
    status: 'good',
    mom_change: '+5%',
    is_displayed_in: ['CEO', 'Board', 'Sales', 'CFO'],
    confidence: 'high',
    definition: { numerator: '月次MRR合計 × 12', denominator: '−', scope: 'PL', note: 'プロダクトMRR全体を年換算した推定ARR', source: 'calculated', refresh_cycle: 'monthly' },
  },
  {
    api_key: 'nrr_pct',
    name: 'NRR',
    category: 'CEO',
    value: 112,
    target: 115,
    unit: '%',
    status: 'good',
    mom_change: '+1pt',
    is_displayed_in: ['CEO', 'Board'],
    confidence: 'high',
    definition: { numerator: '前期末ARR + Expansion − Churn', denominator: '前期末ARR', scope: 'Unit Economics', note: '既存顧客のみの純収益維持率', source: 'kintone', refresh_cycle: 'monthly' },
  },
  {
    api_key: 'churn_rate_pct',
    name: 'Churn Rate',
    category: 'CEO',
    value: 1.0,
    target: 1.5,
    unit: '%',
    status: 'good',
    mom_change: '-0.2pt',
    is_displayed_in: ['CEO', 'Board', 'CS'],
    is_growth_driver: true,
    confidence: 'high',
    definition: { numerator: '解約顧客のMRR合計', denominator: '前月末MRR合計', scope: 'Unit Economics', note: '月次MRRチャーン率', source: 'kintone', refresh_cycle: 'monthly' },
  },
  {
    api_key: 'managed_vehicles',
    name: '管理車両数',
    category: 'CEO',
    value: 95000,
    target: 130000,
    unit: '台',
    status: 'good',
    mom_change: '+3%',
    is_displayed_in: ['CEO', 'Board'],
    confidence: 'high',
    definition: { numerator: 'GrowthBOX導入拠点の管理車両台数合計', denominator: '−', scope: 'Ops', note: '全プロダクト合計の管理車両台数', source: 'manual', refresh_cycle: 'monthly' },
  },
  {
    api_key: 'denso_concentration',
    name: 'Denso売上集中度',
    category: 'CEO',
    value: 75,
    target: 50,
    unit: '%',
    status: 'risk',
    mom_change: '-2pt',
    is_displayed_in: ['CEO', 'Board', 'Sales'],
    priority: 'CRITICAL',
    owner: 'Sales部長',
    next_action: 'Denso外売上比率の引き上げ: 自社直販 + パートナー拡大',
    confidence: 'high',
    definition: { numerator: 'Denso経由売上', denominator: '全売上', scope: 'Sales', note: '単一顧客集中リスク指標。50%以下が目標', source: 'manual', refresh_cycle: 'monthly' },
  },
  {
    api_key: 'sla_violation_rate',
    name: 'SLA違反率',
    category: 'Ops',
    value: 8,
    target: 3,
    unit: '%',
    status: 'risk',
    mom_change: '+1pt',
    is_displayed_in: ['CEO', 'Ops', 'CS'],
    priority: 'HIGH',
    owner: 'Ops部長',
    confidence: 'medium',
    definition: { numerator: 'SLA超過チケット数', denominator: '全チケット数', scope: 'Ops', note: 'SLA違反率。3%以下が目標', source: 'kintone', refresh_cycle: 'weekly' },
  },
  {
    api_key: 'high_risk_accounts',
    name: 'ハイリスクアカウント',
    category: 'CS',
    value: 12,
    target: 5,
    unit: '社',
    status: 'risk',
    mom_change: '+2社',
    is_displayed_in: ['CEO', 'CS'],
    priority: 'CRITICAL',
    owner: 'CS部長',
    next_action: '全12社に個別レスキュープランを発動',
    confidence: 'high',
    definition: { numerator: 'ヘルススコア40点以下のアカウント数', denominator: '−', scope: 'CS', note: 'ハイリスク顧客数', source: 'manual', refresh_cycle: 'weekly' },
  },
  {
    api_key: 'new_customers',
    name: '新規獲得企業数',
    category: 'Sales',
    value: 80,
    target: 100,
    unit: '件/月',
    status: 'warning',
    mom_change: '+10件',
    is_displayed_in: ['CEO', 'Sales'],
    is_growth_driver: true,
    confidence: 'high',
    definition: { numerator: '当月新規契約成立件数', denominator: '−', scope: 'Sales', note: '月次新規獲得企業数', source: 'salesforce', refresh_cycle: 'weekly' },
  },
];

export const P0_ACTIONS: Action[] = [
  {
    name: 'BPaaS投資加速 vs Series B準備の配分決定',
    priority: 'P0',
    status: '実行中',
    owner: 'CFO + CEO',
    deadline: '2026-03-28',
    impact: '成長直結',
    trigger_kpi: 'operating_margin_pct',
    trigger_condition: ['warning', 'risk'],
    reason: '営業利益率5%達成。キャッシュポジティブ基盤を活かした成長投資配分の最適化判断',
  },
  {
    name: '採用加速（Q2 +5名: 開発3名 + CS2名）',
    priority: 'P0',
    status: '実行中',
    owner: 'HR部長 + CEO',
    deadline: '2026-06-30',
    impact: '組織成長',
    trigger_kpi: 'hiring_progress',
    trigger_condition: ['warning', 'risk'],
    reason: '開発リソース不足がバックログ急増・SLA悪化の根本原因',
  },
  {
    name: 'ハイリスク12社に個別レスキュープラン発動',
    priority: 'P0',
    status: '未着手',
    owner: 'CS部長',
    deadline: '2026-04-05',
    impact: 'チャーン防止',
    trigger_kpi: 'high_risk_accounts',
    trigger_condition: ['risk'],
    reason: 'ハイリスク12社・SLA違反率8%・契約更新率88%が即時対応必須',
  },
  {
    name: 'リード獲得戦略のウェビナー軸へのピボット',
    priority: 'P0',
    status: '実行中',
    owner: 'Marketing部長',
    deadline: '2026-04-15',
    impact: 'パイプライン強化',
    trigger_kpi: 'lead_gen_monthly',
    trigger_condition: ['warning', 'risk'],
    reason: '展示会中心のリード獲得が頭打ち。ウェビナー・コンテンツマーケへシフト',
  },
  {
    name: 'ARR定義の統一（3社分の集計方法を標準化）',
    priority: 'P0',
    status: '未着手',
    owner: 'CFO',
    deadline: '2026-04-10',
    impact: '経営判断精度',
    trigger_kpi: 'arr',
    trigger_condition: ['warning'],
    reason: 'ARR定義のズレにより最大±3億円の乖離。経営判断の基盤を揺るがす',
  },
];

export const KEY_DECISIONS: Decision[] = [
  {
    title: 'ARR定義統一（3社計方法の標準化）',
    date: '2026-03-20',
    priority: 'CRITICAL',
    status: 'pending',
    impact: '経営判断の精度向上・投資家報告の信頼性確保',
    impact_level: 'CRITICAL',
    owner: 'CFO',
    due_date: '2026-04-10',
    category: 'Finance',
  },
  {
    title: 'ハイリスク12社レスキュープラン発動',
    date: '2026-03-20',
    priority: 'CRITICAL',
    status: 'pending',
    impact: '年間チャーンMRR▲1,200万円のリスク回避',
    impact_level: 'CRITICAL',
    owner: 'CS部長',
    due_date: '2026-04-05',
    category: 'CS',
  },
  {
    title: 'BPaaS投資拡大に伴うコスト管理計画策定',
    date: '2026-03-19',
    priority: 'HIGH',
    status: 'in_progress',
    impact: '利益維持・成長投資両立',
    impact_level: 'HIGH',
    owner: 'CFO',
    due_date: '2026-04-15',
    category: 'Finance',
  },
];

export const CEO_SUMMARY = '営業利益率5%で目標達成。Denso集中度75%の分散とSeries B準備が最重要課題。バックログ急増でSLAにも黄色信号。採用遅延が組織拡張のボトルネック。';

export const ARR_HISTORY = [
  { month: '2025-04', arr: 20.0 },
  { month: '2025-05', arr: 20.5 },
  { month: '2025-06', arr: 21.0 },
  { month: '2025-07', arr: 21.8 },
  { month: '2025-08', arr: 22.3 },
  { month: '2025-09', arr: 23.0 },
  { month: '2025-10', arr: 23.5 },
  { month: '2025-11', arr: 24.2 },
  { month: '2025-12', arr: 24.8 },
  { month: '2026-01', arr: 25.5 },
  { month: '2026-02', arr: 26.2 },
  { month: '2026-03', arr: 27.0 },
];

// CFO KPIs
export const CFO_KPIS: Kpi[] = [
  { api_key: 'arr', name: '推定ARR', category: 'CFO', value: 27, target: 27, unit: '億円', status: 'good', mom_change: '+5%', is_displayed_in: ['CFO'], confidence: 'high', definition: { numerator: '月次MRR合計 × 12', denominator: '−', scope: 'PL', note: '', source: 'calculated', refresh_cycle: 'monthly' } },
  { api_key: 'gross_margin_pct', name: '粗利率', category: 'CFO', value: 76.3, target: 75, unit: '%', status: 'good', mom_change: '+1.2pt', is_displayed_in: ['CFO'], confidence: 'high', definition: { numerator: '売上高 − 売上原価', denominator: '売上高', scope: 'PL', note: 'SaaS粗利率', source: 'monthly_pl', refresh_cycle: 'monthly' } },
  { api_key: 'operating_margin_pct', name: '営業利益率', category: 'CFO', value: 5, target: 5, unit: '%', status: 'good', mom_change: '+0.8pt', is_displayed_in: ['CFO'], priority: 'MEDIUM', owner: 'CFO', confidence: 'high', definition: { numerator: '営業利益', denominator: '売上高', scope: 'PL', note: '5%=目標達成', source: 'monthly_pl', refresh_cycle: 'monthly' } },
  { api_key: 'opex_total', name: 'OPEX合計', category: 'CFO', value: 5.5, target: 5.5, unit: '億円', status: 'good', mom_change: '-2%', is_displayed_in: ['CFO'], confidence: 'high', definition: { numerator: '管理部門・固定費コスト合計', denominator: '−', scope: 'OPEX', note: '', source: 'monthly_pl', refresh_cycle: 'monthly' } },
  { api_key: 'cash_balance', name: 'キャッシュ残高', category: 'CFO', value: 2, target: 2.5, unit: '億円', status: 'warning', mom_change: '+5%', is_displayed_in: ['CFO'], priority: 'MEDIUM', confidence: 'high', definition: { numerator: '月末時点の現預金残高', denominator: '−', scope: 'PL', note: '手元流動性', source: 'bank_statement', refresh_cycle: 'monthly' } },
  { api_key: 'cfo_burn_rate', name: 'バーンレート', category: 'CFO', value: 4500, target: 4000, unit: '万円/月', status: 'warning', mom_change: '+3%', is_displayed_in: ['CFO'], confidence: 'medium', definition: { numerator: '月次キャッシュ流出額', denominator: '−', scope: 'PL', note: '', source: 'monthly_pl', refresh_cycle: 'monthly' } },
  { api_key: 'cfo_runway', name: 'ランウェイ', category: 'CFO', value: 4.4, target: 6, unit: 'ヶ月', status: 'warning', mom_change: '-0.2ヶ月', is_displayed_in: ['CFO'], priority: 'HIGH', confidence: 'medium', definition: { numerator: 'キャッシュ残高', denominator: 'バーンレート', scope: 'PL', note: '', source: 'calculated', refresh_cycle: 'monthly' } },
  { api_key: 'revenue_annual', name: '推定年商', category: 'CFO', value: 27, target: 27, unit: '億円', status: 'good', mom_change: '+35% YoY', is_displayed_in: ['CFO'], confidence: 'high', definition: { numerator: '当期累計売上高', denominator: '−', scope: 'PL', note: '', source: 'monthly_pl', refresh_cycle: 'monthly' } },
];

// Sales KPIs
export const SALES_KPIS: Kpi[] = [
  { api_key: 'new_customers', name: '新規獲得企業数', category: 'Sales', value: 80, target: 100, unit: '件/月', status: 'warning', mom_change: '+10件', is_displayed_in: ['Sales'], is_growth_driver: true, priority: 'HIGH', confidence: 'high', definition: { numerator: '当月新規契約成立件数', denominator: '−', scope: 'Sales', note: '', source: 'salesforce', refresh_cycle: 'weekly' } },
  { api_key: 'mrr_net', name: 'Net New MRR', category: 'Sales', value: 800, target: 1000, unit: '万円', status: 'warning', mom_change: '+200万', is_displayed_in: ['Sales'], confidence: 'high', definition: { numerator: '新規MRR + Expansion − Churn', denominator: '−', scope: 'PL', note: '', source: 'calculated', refresh_cycle: 'monthly' } },
  { api_key: 'pipeline_leads', name: 'リード数（月次）', category: 'Sales', value: 200, target: 220, unit: '件', status: 'warning', mom_change: '+10件', is_displayed_in: ['Sales'], confidence: 'medium', definition: { numerator: 'アクティブリード数', denominator: '−', scope: 'Sales', note: '', source: 'salesforce', refresh_cycle: 'weekly' } },
  { api_key: 'meeting_rate', name: '商談化率', category: 'Sales', value: 30, target: 35, unit: '%', status: 'warning', mom_change: '+1pt', is_displayed_in: ['Sales'], confidence: 'medium', definition: { numerator: '商談化件数', denominator: 'リード数', scope: 'Sales', note: '', source: 'salesforce', refresh_cycle: 'weekly' } },
  { api_key: 'close_rate', name: '受注率', category: 'Sales', value: 20, target: 25, unit: '%', status: 'warning', mom_change: '+1pt', is_displayed_in: ['Sales'], confidence: 'medium', definition: { numerator: '受注件数', denominator: '商談件数', scope: 'Sales', note: '', source: 'salesforce', refresh_cycle: 'weekly' } },
  { api_key: 'pipeline_value', name: 'パイプライン総額', category: 'Sales', value: 4500, target: 5000, unit: '万円', status: 'warning', mom_change: '+300万', is_displayed_in: ['Sales'], confidence: 'medium', definition: { numerator: '全アクティブ商談の期待金額合計', denominator: '−', scope: 'Sales', note: '', source: 'salesforce', refresh_cycle: 'weekly' } },
  { api_key: 'nrr_pct', name: 'NRR', category: 'Sales', value: 112, target: 115, unit: '%', status: 'good', mom_change: '+1pt', is_displayed_in: ['Sales'], confidence: 'high', definition: { numerator: '前期末ARR + Expansion − Churn', denominator: '前期末ARR', scope: 'Unit Economics', note: '', source: 'kintone', refresh_cycle: 'monthly' } },
  { api_key: 'churn_rate_pct', name: 'Churn Rate', category: 'Sales', value: 1, target: 1.5, unit: '%', status: 'good', mom_change: '-0.2pt', is_displayed_in: ['Sales'], confidence: 'high', definition: { numerator: '解約MRR', denominator: '前月末MRR', scope: 'Unit Economics', note: '', source: 'kintone', refresh_cycle: 'monthly' } },
  { api_key: 'denso_concentration', name: 'Denso売上集中度', category: 'Sales', value: 75, target: 50, unit: '%', status: 'risk', mom_change: '-2pt', is_displayed_in: ['Sales'], priority: 'CRITICAL', confidence: 'high', definition: { numerator: 'Denso経由売上', denominator: '全売上', scope: 'Sales', note: '', source: 'manual', refresh_cycle: 'monthly' } },
];

export const MRR_BREAKDOWN = [
  { name: 'Fleet (GBC/GBCDR)', value: 8333 },
  { name: 'BSS', value: 6667 },
  { name: 'ALC', value: 5000 },
  { name: '新サービス', value: 2500 },
];

// CS KPIs
export const CS_KPIS: Kpi[] = [
  { api_key: 'customer_health_score', name: '顧客健全性スコア', category: 'CS', value: 78, target: 80, unit: '点', status: 'warning', mom_change: '+2pt', is_displayed_in: ['CS'], priority: 'HIGH', confidence: 'medium', definition: { numerator: '複合スコア', denominator: '100点満点', scope: 'CS', note: '解約リスクの先行複合指標', source: 'crm_kintone', refresh_cycle: 'weekly' } },
  { api_key: 'high_risk_accounts', name: 'ハイリスクアカウント', category: 'CS', value: 12, target: 5, unit: '社', status: 'risk', mom_change: '+4社', is_displayed_in: ['CS'], priority: 'CRITICAL', owner: 'CS部長', next_action: '全12社に個別レスキュープランを発動', confidence: 'medium', definition: { numerator: 'ヘルススコア閾値以下の顧客数', denominator: '−', scope: 'CS', note: '1社解約≒MRR150万円喪失', source: 'crm_kintone', refresh_cycle: 'weekly' } },
  { api_key: 'cs_sla_violation_rate', name: 'SLA違反率', category: 'CS', value: 8, target: 5, unit: '%', status: 'warning', mom_change: '+3pt', is_displayed_in: ['CS'], priority: 'CRITICAL', confidence: 'high', definition: { numerator: 'SLA超過チケット数', denominator: '総チケット数', scope: 'CS', note: '', source: 'ticketing_system', refresh_cycle: 'daily' } },
  { api_key: 'cs_renewal_rate', name: '契約更新率', category: 'CS', value: 88, target: 95, unit: '%', status: 'risk', mom_change: '-2pt', is_displayed_in: ['CS'], priority: 'HIGH', confidence: 'high', definition: { numerator: '更新顧客数', denominator: '更新対象顧客数', scope: 'CS', note: '', source: 'crm_kintone', refresh_cycle: 'monthly' } },
  { api_key: 'cs_active_rate', name: 'アクティブ率', category: 'CS', value: 72, target: 80, unit: '%', status: 'warning', mom_change: '-3pt', is_displayed_in: ['CS'], priority: 'HIGH', next_action: '未ログイン30日以上の顧客にCSからプロアクティブ連絡', confidence: 'medium', definition: { numerator: '過去30日ログインユーザー数', denominator: '総契約ユーザー数', scope: 'CS', note: '', source: 'product_analytics', refresh_cycle: 'weekly' } },
  { api_key: 'cs_onboarding_complete', name: 'オンボーディング完了率', category: 'CS', value: 84, target: 90, unit: '%', status: 'warning', mom_change: '+4pt', is_displayed_in: ['CS'], confidence: 'medium', definition: { numerator: 'オンボーディング完了顧客数', denominator: '新規契約顧客数', scope: 'CS', note: '', source: 'crm_kintone', refresh_cycle: 'weekly' } },
  { api_key: 'support_resolution_rate', name: 'チケット解決率', category: 'CS', value: 93, target: 95, unit: '%', status: 'warning', mom_change: '+1pt', is_displayed_in: ['CS'], confidence: 'high', definition: { numerator: '解決済みチケット数', denominator: '総チケット数', scope: 'CS', note: '', source: 'ticketing_system', refresh_cycle: 'weekly' } },
  { api_key: 'cs_avg_response_time', name: '平均応答時間', category: 'CS', value: 18, target: 24, unit: '時間', status: 'good', mom_change: '-4h', is_displayed_in: ['CS'], confidence: 'high', definition: { numerator: '応答時間合計', denominator: '対応チケット件数', scope: 'CS', note: '低いほど良い', source: 'ticketing_system', refresh_cycle: 'daily' } },
  { api_key: 'upsell_rate', name: 'アップセル率', category: 'CS', value: 12, target: 15, unit: '%', status: 'warning', mom_change: '+1pt', is_displayed_in: ['CS'], confidence: 'medium', definition: { numerator: 'アップセル成立件数', denominator: '既存顧客数', scope: 'Unit Economics', note: '', source: 'salesforce', refresh_cycle: 'monthly' } },
  { api_key: 'cs_rescue_plan_progress', name: 'レスキュープラン実行率', category: 'CS', value: 42, target: 100, unit: '%', status: 'risk', mom_change: '+15pt', is_displayed_in: ['CS'], priority: 'CRITICAL', next_action: '未着手7社のレスキュープランを今週中に発動', confidence: 'medium', definition: { numerator: '実行済み顧客数', denominator: 'ハイリスク顧客数', scope: 'CS', note: '', source: 'crm_kintone', refresh_cycle: 'weekly' } },
];

// HR KPIs
export const HR_KPIS: Kpi[] = [
  { api_key: 'employees', name: '従業員数', category: 'HR', value: 80, target: 90, unit: '名', status: 'good', mom_change: '+3名', is_displayed_in: ['HR'], confidence: 'high', definition: { numerator: '月末在籍者数', denominator: '−', scope: 'HR', note: '', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'hires_ytd', name: '採用進捗（YTD）', category: 'HR', value: 16, target: 26, unit: '名', status: 'warning', mom_change: '+2名', is_displayed_in: ['HR'], priority: 'HIGH', next_action: 'BizReachスカウト倍増＋開発JD刷新', confidence: 'high', definition: { numerator: '年度累計の採用入社者数', denominator: '−', scope: 'HR', note: '', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'attrition_rate', name: '離職率', category: 'HR', value: 8, target: 10, unit: '%', status: 'good', mom_change: '-1pt', is_displayed_in: ['HR'], confidence: 'high', definition: { numerator: '当期退職者数', denominator: '期初在籍者数', scope: 'HR', note: '低いほど良い', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'sales_per_head', name: '1人あたり売上', category: 'HR', value: 281, target: 300, unit: '万円/月', status: 'warning', mom_change: '+12万', is_displayed_in: ['HR'], confidence: 'medium', definition: { numerator: '月次売上高', denominator: '全従業員数', scope: 'Unit Economics', note: '', source: 'calculated', refresh_cycle: 'monthly' } },
  { api_key: 'recruitment_lead_time', name: '採用リードタイム', category: 'HR', value: 42, target: 30, unit: '日', status: 'warning', mom_change: '-3日', is_displayed_in: ['HR'], confidence: 'medium', definition: { numerator: '求人掲載日から内定承諾日', denominator: '−', scope: 'HR', note: '低いほど良い', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'offer_acceptance_rate', name: '内定承諾率', category: 'HR', value: 78, target: 85, unit: '%', status: 'warning', mom_change: '+3pt', is_displayed_in: ['HR'], next_action: 'オファー面談強化＋報酬レンジ見直し', confidence: 'medium', definition: { numerator: '内定承諾者数', denominator: '内定通知者数', scope: 'HR', note: '', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'recruitment_unit_cost', name: '採用単価', category: 'HR', value: 45, target: 40, unit: '万円/人', status: 'warning', mom_change: '-3万', is_displayed_in: ['HR'], confidence: 'medium', definition: { numerator: '採用関連費用合計', denominator: '採用入社者数', scope: 'OPEX', note: '低いほど良い', source: 'hr_system', refresh_cycle: 'monthly' } },
  { api_key: 'labor_cost_ratio', name: '人件費率', category: 'HR', value: 62, target: 60, unit: '%', status: 'warning', mom_change: '-1pt', is_displayed_in: ['HR'], next_action: '業務委託比率見直し', confidence: 'medium', definition: { numerator: '人件費総額', denominator: 'OPEX合計', scope: 'OPEX', note: '', source: 'monthly_pl', refresh_cycle: 'monthly' } },
];

export const DEPT_BREAKDOWN = [
  { name: '営業', headcount: 15, productivity: 450 },
  { name: '開発', headcount: 30, productivity: 280 },
  { name: 'サポート', headcount: 28, productivity: 230 },
  { name: '管理', headcount: 7, productivity: 210 },
];

// Ops KPIs
export const OPS_KPIS: Kpi[] = [
  { api_key: 'support_tickets', name: 'サポートチケット数', category: 'Ops', value: 750, target: 600, unit: '件', status: 'warning', mom_change: '+3%', is_displayed_in: ['Ops'], priority: 'MEDIUM', confidence: 'high', definition: { numerator: '月次新規チケット数', denominator: '−', scope: 'Ops', note: '少ないほど良い', source: 'ticketing_system', refresh_cycle: 'daily' } },
  { api_key: 'sla_violation_rate', name: 'SLA違反率', category: 'Ops', value: 8, target: 3, unit: '%', status: 'risk', mom_change: '+1pt', is_displayed_in: ['Ops'], priority: 'HIGH', owner: 'Ops部長', confidence: 'medium', definition: { numerator: 'SLA超過チケット数', denominator: '全チケット数', scope: 'Ops', note: '', source: 'kintone', refresh_cycle: 'weekly' } },
  { api_key: 'installation_time', name: '設置リードタイム', category: 'Ops', value: 14, target: 12, unit: '日', status: 'warning', mom_change: '-2日', is_displayed_in: ['Ops'], confidence: 'medium', definition: { numerator: '設置完了までの平均所要日数', denominator: '−', scope: 'Ops', note: '低いほど良い', source: 'growthbox_ops', refresh_cycle: 'weekly' } },
  { api_key: 'installation_delay_months', name: '設置遅延月数', category: 'Ops', value: 2, target: 0, unit: 'ヶ月', status: 'risk', mom_change: '±0', is_displayed_in: ['Ops'], priority: 'HIGH', confidence: 'medium', definition: { numerator: '設置予定日超過月数', denominator: '−', scope: 'Ops', note: 'ゼロが目標', source: 'growthbox_ops', refresh_cycle: 'weekly' } },
  { api_key: 'managed_vehicles', name: '管理車両数', category: 'Ops', value: 95000, target: 130000, unit: '台', status: 'good', mom_change: '+3%', is_displayed_in: ['Ops'], confidence: 'high', definition: { numerator: 'GrowthBOX管理車両台数合計', denominator: '−', scope: 'Ops', note: '', source: 'manual', refresh_cycle: 'monthly' } },
  { api_key: 'ops_backlog', name: 'バックログ', category: 'Ops', value: 180, target: 100, unit: '件', status: 'risk', mom_change: '+15件', is_displayed_in: ['Ops'], priority: 'HIGH', next_action: '開発リソース増強で消化加速', confidence: 'medium', definition: { numerator: '未処理タスク数', denominator: '−', scope: 'Ops', note: '少ないほど良い', source: 'jira', refresh_cycle: 'weekly' } },
];

// 6ヶ月トレンドデータ (10月〜3月)
export const KPI_TRENDS: Record<string, number[]> = {
  arr:                  [22, 23, 24, 25, 26, 27],
  nrr_pct:             [108, 109, 110, 111, 112, 112],
  churn_rate_pct:      [1.4, 1.3, 1.2, 1.1, 1.0, 1.0],
  managed_vehicles:    [80000, 83000, 86000, 89000, 92000, 95000],
  denso_concentration: [82, 80, 79, 77, 76, 75],
  sla_violation_rate:  [4, 5, 6, 7, 7, 8],
  high_risk_accounts:  [6, 7, 8, 9, 11, 12],
  new_customers:       [60, 65, 70, 72, 75, 80],
  gross_margin_pct:    [74, 74.5, 75, 75.5, 76, 76.3],
  operating_margin_pct:[3, 3.5, 4, 4.2, 4.8, 5],
  cash_balance:        [2.5, 2.4, 2.3, 2.2, 2.1, 2.0],
  cfo_burn_rate:       [3800, 3900, 4000, 4200, 4400, 4500],
  cfo_runway:          [5.5, 5.2, 5.0, 4.8, 4.6, 4.4],
  pipeline_leads:      [170, 180, 185, 190, 195, 200],
  meeting_rate:        [26, 27, 28, 29, 30, 30],
  close_rate:          [17, 18, 18, 19, 20, 20],
  pipeline_value:      [3500, 3800, 4000, 4100, 4300, 4500],
  customer_health_score:[72, 73, 74, 75, 77, 78],
  cs_sla_violation_rate:[4, 5, 5, 6, 7, 8],
  cs_renewal_rate:     [93, 92, 91, 90, 89, 88],
};

// 関連KPI
export const KPI_DEPENDENCIES: Record<string, string[]> = {
  arr:                  ['NRR', 'Churn Rate', '新規獲得企業数'],
  nrr_pct:             ['Churn Rate', 'Expansion MRR', '顧客健全性スコア'],
  churn_rate_pct:      ['顧客健全性スコア', 'ハイリスクアカウント', '契約更新率'],
  managed_vehicles:    ['ARR', '新規獲得企業数'],
  denso_concentration: ['ARR', '新規獲得企業数'],
  sla_violation_rate:  ['顧客健全性スコア', 'ハイリスクアカウント'],
  high_risk_accounts:  ['Churn Rate', '契約更新率', '顧客健全性スコア'],
  new_customers:       ['パイプライン総額', '商談化率', '受注率'],
  gross_margin_pct:    ['ARR', 'OPEX合計'],
  operating_margin_pct:['粗利率', 'OPEX合計'],
  cash_balance:        ['バーンレート', 'ランウェイ'],
  cfo_burn_rate:       ['ランウェイ', 'OPEX合計'],
  cfo_runway:          ['キャッシュ残高', 'バーンレート'],
  pipeline_leads:      ['商談化率', '受注率'],
  meeting_rate:        ['リード数', '受注率'],
  close_rate:          ['商談化率', 'パイプライン総額'],
  pipeline_value:      ['リード数', '商談化率', '受注率'],
  customer_health_score:['Churn Rate', 'SLA違反率', 'ハイリスクアカウント'],
  cs_sla_violation_rate:['顧客健全性スコア', 'ハイリスクアカウント'],
  cs_renewal_rate:     ['顧客健全性スコア', 'Churn Rate'],
};

// 部門横断KPIヒートマップ用
export const ALL_DEPARTMENT_KPIS: Record<string, { api_key: string; name: string; value: number | null; target: number; unit: string; status: string }[]> = {
  CEO:   [
    { api_key: 'arr', name: 'ARR', value: 27, target: 27, unit: '億円', status: 'good' },
    { api_key: 'nrr_pct', name: 'NRR', value: 112, target: 115, unit: '%', status: 'good' },
    { api_key: 'churn_rate_pct', name: 'Churn', value: 1.0, target: 1.5, unit: '%', status: 'good' },
    { api_key: 'managed_vehicles', name: '管理車両', value: 95000, target: 130000, unit: '台', status: 'good' },
    { api_key: 'denso_concentration', name: 'Denso集中', value: 75, target: 50, unit: '%', status: 'risk' },
  ],
  CFO:   [
    { api_key: 'gross_margin_pct', name: '粗利率', value: 76.3, target: 75, unit: '%', status: 'good' },
    { api_key: 'operating_margin_pct', name: '営業利益率', value: 5, target: 5, unit: '%', status: 'good' },
    { api_key: 'cash_balance', name: 'キャッシュ', value: 2, target: 2.5, unit: '億円', status: 'warning' },
    { api_key: 'cfo_burn_rate', name: 'バーン', value: 4500, target: 4000, unit: '万円', status: 'warning' },
    { api_key: 'cfo_runway', name: 'ランウェイ', value: 4.4, target: 6, unit: 'ヶ月', status: 'warning' },
  ],
  Sales: [
    { api_key: 'new_customers', name: '新規獲得', value: 80, target: 100, unit: '件', status: 'warning' },
    { api_key: 'pipeline_leads', name: 'リード', value: 200, target: 220, unit: '件', status: 'warning' },
    { api_key: 'meeting_rate', name: '商談化率', value: 30, target: 35, unit: '%', status: 'warning' },
    { api_key: 'close_rate', name: '受注率', value: 20, target: 25, unit: '%', status: 'warning' },
    { api_key: 'pipeline_value', name: 'パイプライン', value: 4500, target: 5000, unit: '万円', status: 'warning' },
  ],
  CS:    [
    { api_key: 'customer_health_score', name: '健全性', value: 78, target: 80, unit: '点', status: 'warning' },
    { api_key: 'high_risk_accounts', name: 'ハイリスク', value: 12, target: 5, unit: '社', status: 'risk' },
    { api_key: 'cs_sla_violation_rate', name: 'SLA違反', value: 8, target: 5, unit: '%', status: 'warning' },
    { api_key: 'cs_renewal_rate', name: '更新率', value: 88, target: 95, unit: '%', status: 'risk' },
  ],
  HR:    [
    { api_key: 'headcount', name: '社員数', value: 45, target: 60, unit: '名', status: 'warning' },
    { api_key: 'retention_rate', name: '定着率', value: 92, target: 90, unit: '%', status: 'good' },
    { api_key: 'eng_ratio', name: 'エンジニア比率', value: 38, target: 40, unit: '%', status: 'warning' },
  ],
  Ops:   [
    { api_key: 'sla_violation_rate', name: 'SLA違反', value: 8, target: 3, unit: '%', status: 'risk' },
    { api_key: 'managed_vehicles', name: '管理車両', value: 95000, target: 130000, unit: '台', status: 'good' },
    { api_key: 'ops_backlog', name: 'バックログ', value: 180, target: 100, unit: '件', status: 'risk' },
    { api_key: 'installation_time', name: '設置LT', value: 14, target: 12, unit: '日', status: 'warning' },
  ],
};

// プロダクトライン
export const PRODUCT_LINES = [
  { id: 'gbc',       shortName: 'GBC',       description: 'GrowthBOX Core',    color: '#3b82f6', currentArr: 12, targetArr2035: 35 },
  { id: 'gbcdr',     shortName: 'GBCDR',     description: 'GBC + ドラレコ',    color: '#6366f1', currentArr: 5,  targetArr2035: 18 },
  { id: 'bss',       shortName: 'BSS',       description: 'BSS点呼',           color: '#10b981', currentArr: 6,  targetArr2035: 20 },
  { id: 'bssforalc', shortName: 'BSSforALC', description: 'アルコール検知',   color: '#f59e0b', currentArr: 3,  targetArr2035: 12 },
  { id: 'new_svc',   shortName: '新サービス', description: '次世代サービス',   color: '#8b5cf6', currentArr: 1,  targetArr2035: 10 },
  { id: 'new_prod',  shortName: '新製品',     description: 'ハードウェア',     color: '#ef4444', currentArr: 0,  targetArr2035: 5  },
];

// 100億ロードマップ（積み上げ棒グラフ用）
export const PRODUCT_ROADMAP = [
  { year: 2025, GBC: 13, GBCDR: 5,  BSS: 6,  BSSforALC: 3, '新サービス': 0, '新製品': 0 },
  { year: 2026, GBC: 16, GBCDR: 7,  BSS: 8,  BSSforALC: 4, '新サービス': 1, '新製品': 0 },
  { year: 2027, GBC: 19, GBCDR: 9,  BSS: 10, BSSforALC: 5, '新サービス': 2, '新製品': 1 },
  { year: 2028, GBC: 22, GBCDR: 11, BSS: 12, BSSforALC: 7, '新サービス': 4, '新製品': 2 },
  { year: 2029, GBC: 25, GBCDR: 13, BSS: 14, BSSforALC: 8, '新サービス': 5, '新製品': 2 },
  { year: 2030, GBC: 28, GBCDR: 15, BSS: 16, BSSforALC: 9, '新サービス': 7, '新製品': 3 },
  { year: 2031, GBC: 30, GBCDR: 16, BSS: 17, BSSforALC: 10, '新サービス': 8, '新製品': 3 },
  { year: 2032, GBC: 32, GBCDR: 17, BSS: 18, BSSforALC: 11, '新サービス': 9, '新製品': 4 },
  { year: 2033, GBC: 33, GBCDR: 17, BSS: 19, BSSforALC: 11, '新サービス': 9, '新製品': 4 },
  { year: 2034, GBC: 34, GBCDR: 18, BSS: 19, BSSforALC: 12, '新サービス': 10, '新製品': 5 },
  { year: 2035, GBC: 35, GBCDR: 18, BSS: 20, BSSforALC: 12, '新サービス': 10, '新製品': 5 },
];

// 100億宣言 戦略目標
export interface StrategicGoal {
  id: string;
  number: number;
  title: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind';
  keyMetrics: { label: string; current: string; target: string }[];
  challenges: string[];
  measures: string[];
}

export const STRATEGIC_GOALS: StrategicGoal[] = [
  {
    id: 'goal1', number: 1,
    title: '管理車両数 13万台達成（2030年）',
    progress: 73,
    status: 'on_track',
    keyMetrics: [
      { label: '現在', current: '95,000台', target: '130,000台' },
      { label: '月次純増', current: '約800台', target: '1,200台' },
    ],
    challenges: ['Denso経由販売への依存（売上75%集中）', '自社直販チャネルが未確立'],
    measures: ['パートナー戦略でDealer網を拡充', '直販チームを2026年Q1に組成'],
  },
  {
    id: 'goal2', number: 2,
    title: 'ARR 100億円（2035年）',
    progress: 27,
    status: 'at_risk',
    keyMetrics: [
      { label: '現在ARR', current: '27億円', target: '100億円' },
      { label: 'ARPU', current: '27万円/年', target: '65万円/年' },
    ],
    challenges: ['ARPU単価が目標の約40%水準', 'クロスセル率が低い'],
    measures: ['BSSforALC + GBC バンドル展開', '大口顧客へのエンタープライズプラン策定'],
  },
  {
    id: 'goal3', number: 3,
    title: 'NRR 120%達成',
    progress: 55,
    status: 'at_risk',
    keyMetrics: [
      { label: '現在NRR', current: '112%', target: '120%' },
      { label: 'Churn率', current: '1.0%', target: '0.8%' },
    ],
    challenges: ['ハイリスクアカウント12社が解約リスク', 'CS人員が不足'],
    measures: ['CS部門増員（2名採用）', 'ハイリスク12社に専任CSM配置'],
  },
  {
    id: 'goal4', number: 4,
    title: 'Denso売上集中度 50%以下',
    progress: 40,
    status: 'behind',
    keyMetrics: [
      { label: '現在', current: '75%', target: '50%以下' },
      { label: '直販比率', current: '25%', target: '50%' },
    ],
    challenges: ['Denso依存からの脱却に時間軸が必要', '新規パートナー開拓が遅延'],
    measures: ['2026年中に新規代理店10社との契約締結', '自社展示会・セミナーの年4回開催'],
  },
  {
    id: 'goal5', number: 5,
    title: '新規月次獲得 100社/月',
    progress: 80,
    status: 'at_risk',
    keyMetrics: [
      { label: '現在', current: '80社/月', target: '100社/月' },
      { label: 'パイプライン', current: '4,500万円', target: '5,000万円' },
    ],
    challenges: ['商談化率が30%（目標35%）', 'SDR人員が不足'],
    measures: ['インサイドセールス2名採用', 'ABM施策でエンタープライズ開拓強化'],
  },
];

export const DEFAULT_SIMULATOR_PARAMS = {
  managedVehicles: 95000,
  customers: 10000,
  monthlyNetNew: 62,
  arpu: 27,
  growthRate: 35,
  churnRate: 1.0,
};
