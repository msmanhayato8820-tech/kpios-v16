import { Kpi, Action, Decision, User } from '@/types';

export const MOCK_USERS: User[] = [
  { email: 'ceo@anestsystem.jp', name: '尾田 専務', role: 'CEO' },
  { email: 'cfo@anestsystem.jp', name: '財務部長', role: 'CFO' },
  { email: 'sales@anestsystem.jp', name: '営業部長', role: 'Sales' },
  { email: 'cs@anestsystem.jp', name: 'CS部長', role: 'CS' },
  { email: 'hr@anestsystem.jp', name: 'HR部長', role: 'HR' },
  { email: 'ops@anestsystem.jp', name: 'Ops部長', role: 'Ops' },
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
    id: 'DEC-001',
    title: 'ARR定義統一（3社計方法の標準化）',
    date: '2026-03-20',
    priority: 'CRITICAL',
    status: 'pending',
    context: 'ARR算出方法が3事業で異なり、最大±3億円の乖離が発生。投資家報告・経営判断の基盤が揺らいでいる。',
    options: [
      {
        label: 'A: IFRS準拠で即時統一',
        pros: ['投資家向け信頼性が最高', 'グローバル基準で比較可能'],
        cons: ['移行コスト大（約2ヶ月）', '過去データの再計算が必要'],
        estimated_impact: '経営判断精度が90%→99%に向上',
        cost: '約500万円（コンサル＋システム改修）',
        risk_level: 'MEDIUM',
      },
      {
        label: 'B: 社内独自基準で段階的統一',
        pros: ['低コスト', '段階移行でリスク小'],
        cons: ['投資家説明に追加工数', '独自基準の維持コスト'],
        estimated_impact: '精度改善は80%程度',
        cost: '約150万円',
        risk_level: 'LOW',
      },
    ],
    impact: '経営判断の精度向上・投資家報告の信頼性確保',
    impact_level: 'CRITICAL',
    risks: ['移行期間中のレポート不整合', '過去データとの連続性断絶'],
    owner: 'CFO',
    stakeholders: ['CEO', '経理部長', '外部監査法人'],
    due_date: '2026-04-10',
    category: 'Finance',
    linked_kpis: ['arr', 'mrr'],
    linked_actions: ['ARR定義統一レポート作成'],
  },
  {
    id: 'DEC-002',
    title: 'ハイリスク12社レスキュープラン発動',
    date: '2026-03-20',
    priority: 'CRITICAL',
    status: 'pending',
    context: 'NPS急落＋利用率低下の12社を特定。放置すると年間チャーンMRR▲1,200万円のリスク。',
    options: [
      {
        label: 'A: 全12社に専任CSを配置',
        pros: ['最速で対応可能', '顧客満足度回復が見込める'],
        cons: ['CS人員が逼迫', '他案件への影響'],
        estimated_impact: 'チャーン率70%削減',
        cost: 'CS2名の3ヶ月アサイン',
        risk_level: 'MEDIUM',
      },
      {
        label: 'B: 上位6社のみ重点対応',
        pros: ['リソース効率が良い', 'MRR上位をカバー'],
        cons: ['残り6社のチャーンリスク残存'],
        estimated_impact: 'チャーン率40%削減',
        cost: 'CS1名の3ヶ月アサイン',
        risk_level: 'HIGH',
      },
      {
        label: 'C: プロダクト改善で一括対応',
        pros: ['根本解決', 'スケーラブル'],
        cons: ['時間がかかる（2-3ヶ月）', '個社対応が不十分'],
        estimated_impact: '長期的にチャーン率50%削減',
        cost: '開発工数2人月',
        risk_level: 'HIGH',
      },
    ],
    impact: '年間チャーンMRR▲1,200万円のリスク回避',
    impact_level: 'CRITICAL',
    risks: ['CS人員の過負荷', '対応遅延による顧客離脱加速'],
    owner: 'CS部長',
    stakeholders: ['CEO', 'Sales部長', 'Product'],
    due_date: '2026-04-05',
    category: 'CS',
    linked_kpis: ['churn_rate', 'nps'],
    linked_actions: ['ハイリスク顧客訪問スケジュール'],
  },
  {
    id: 'DEC-003',
    title: 'BPaaS投資拡大に伴うコスト管理計画策定',
    date: '2026-03-19',
    priority: 'HIGH',
    status: 'in_progress',
    context: 'BPaaS事業の本格展開に向け投資拡大が必要だが、営業利益率5%の維持も求められる。',
    options: [
      {
        label: 'A: 段階投資（Q2に3,000万、Q3に5,000万）',
        pros: ['リスク分散', '途中で軌道修正可能'],
        cons: ['競合に先行される可能性', '人材確保が遅れる'],
        estimated_impact: 'BPaaS売上Q4に月500万達成',
        cost: '8,000万円/年',
        risk_level: 'MEDIUM',
      },
      {
        label: 'B: 一括投資（Q2に8,000万）',
        pros: ['早期に市場ポジション確立', '人材確保が容易'],
        cons: ['キャッシュフロー圧迫', '失敗時のダメージ大'],
        estimated_impact: 'BPaaS売上Q3に月800万達成',
        cost: '8,000万円/年',
        risk_level: 'HIGH',
      },
    ],
    selected_option: 0,
    decision_rationale: '段階投資を選択。Q2の実績を見て追加投資判断することでリスクを管理する。',
    impact: '利益維持・成長投資両立',
    impact_level: 'HIGH',
    risks: ['投資回収の遅延', '人材採用の競争激化'],
    owner: 'CFO',
    stakeholders: ['CEO', 'Product責任者', '取締役会'],
    due_date: '2026-04-15',
    decided_at: '2026-03-25',
    category: 'Finance',
    linked_kpis: ['operating_margin', 'bpaas_revenue'],
    linked_actions: ['BPaaS投資計画書作成'],
  },
  {
    id: 'DEC-004',
    title: 'Denso集中度分散戦略の選定',
    date: '2026-03-15',
    priority: 'HIGH',
    status: 'done',
    context: 'Denso売上集中度75%は事業リスク。2027年までに60%以下を目標とし、分散戦略を決定する必要がある。',
    options: [
      {
        label: 'A: 物流業界への横展開',
        pros: ['既存プロダクトの転用可能', '市場規模大'],
        cons: ['営業体制の構築が必要', '業界知識不足'],
        estimated_impact: '新規売上年3億円見込み',
        cost: '営業3名採用＋マーケ費2,000万',
        risk_level: 'MEDIUM',
      },
      {
        label: 'B: 製造業の中堅企業開拓',
        pros: ['業界知見あり', '既存レファレンス活用可'],
        cons: ['単価が低い', '案件数でカバーが必要'],
        estimated_impact: '新規売上年1.5億円見込み',
        cost: '営業2名採用',
        risk_level: 'LOW',
      },
    ],
    selected_option: 0,
    decision_rationale: '市場規模と成長性を重視し物流業界への横展開を選択。Q2から営業チーム立ち上げ。',
    impact: 'Denso依存度75%→60%への道筋',
    impact_level: 'HIGH',
    risks: ['新規業界での受注サイクルが読めない', '既存顧客対応のリソース分散'],
    owner: 'Sales部長',
    stakeholders: ['CEO', 'Product', 'Marketing'],
    due_date: '2026-03-30',
    decided_at: '2026-03-28',
    category: 'Sales',
    linked_kpis: ['denso_concentration', 'new_logo'],
    linked_actions: ['物流業界営業チーム組成'],
    outcome: '物流大手3社への提案開始。1社がPoC実施決定。',
    outcome_evaluation: 'success',
  },
  {
    id: 'DEC-005',
    title: 'AI/IoT新製品ロードマップ承認',
    date: '2026-03-10',
    priority: 'MEDIUM',
    status: 'draft',
    context: '2035年100億円目標達成のため、次世代製品としてAI予知保全ソリューションの開発ロードマップを策定中。',
    options: [
      {
        label: 'A: 自社開発（フルスクラッチ）',
        pros: ['IP確保', '差別化が明確'],
        cons: ['開発期間18ヶ月', 'AI人材の採用が必要'],
        estimated_impact: '3年後に年間売上5億円',
        cost: '開発費1.5億円',
        risk_level: 'HIGH',
      },
      {
        label: 'B: パートナー企業との共同開発',
        pros: ['開発期間短縮', 'リスク分担'],
        cons: ['IP共有', '利益分配'],
        estimated_impact: '2年後に年間売上3億円',
        cost: '開発費5,000万＋レベニューシェア',
        risk_level: 'MEDIUM',
      },
      {
        label: 'C: OEM/ホワイトラベル導入',
        pros: ['最短で市場投入', '低コスト'],
        cons: ['差別化困難', 'ベンダーロックイン'],
        estimated_impact: '半年後に年間売上1億円',
        cost: 'ライセンス費年2,000万',
        risk_level: 'LOW',
      },
    ],
    impact: '2035年100億円ロードマップの中核プロダクト',
    impact_level: 'HIGH',
    risks: ['技術的実現性の不確実性', 'AI人材獲得競争'],
    owner: 'Product責任者',
    stakeholders: ['CEO', 'CTO', 'Sales部長'],
    due_date: '2026-04-30',
    category: 'Product',
    linked_kpis: ['product_nps', 'feature_adoption'],
    linked_actions: [],
  },
  {
    id: 'DEC-006',
    title: '新卒採用枠の拡大判断',
    date: '2026-03-05',
    priority: 'MEDIUM',
    status: 'done',
    context: '事業拡大に伴い、2027年度の新卒採用を現行5名→10名に拡大すべきか判断が必要。',
    options: [
      {
        label: 'A: 10名に倍増',
        pros: ['将来の幹部候補確保', '組織の若返り'],
        cons: ['育成負荷増大', '固定費増加'],
        estimated_impact: '2028年以降の組織力強化',
        cost: '採用費＋人件費で年3,000万増',
        risk_level: 'MEDIUM',
      },
      {
        label: 'B: 7名に微増',
        pros: ['バランス型', '育成品質を維持'],
        cons: ['成長ペースに足りない可能性'],
        estimated_impact: '2028年以降の安定的な組織拡大',
        cost: '年1,500万増',
        risk_level: 'LOW',
      },
    ],
    selected_option: 1,
    decision_rationale: '育成体制を先に整備し、2028年度に本格拡大する段階的アプローチを採用。',
    impact: '組織力・採用ブランドの強化',
    impact_level: 'MEDIUM',
    risks: ['採用競争での不利', '即戦力不足'],
    owner: 'HR部長',
    stakeholders: ['CEO', '各部門長'],
    due_date: '2026-03-20',
    decided_at: '2026-03-18',
    category: 'HR',
    linked_kpis: ['headcount', 'retention_rate'],
    linked_actions: ['2027年度採用計画策定'],
    outcome: '7名採用で内定承諾率86%を達成。',
    outcome_evaluation: 'success',
  },
];

export const CEO_SUMMARY = '2035年売上高100億円目標に向け、SaaS型安定成長・売上構成多角化・事業領域拡張の3本柱で推進中。営業利益率5%達成。Denso集中度75%の分散が最重要課題。BPaaS本格展開とAI/IoT活用による次世代製品開発を加速。';

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
  { name: 'GBC/GBCDR（運行管理・安全運転管理）', value: 8333 },
  { name: 'BSS（業種特化型グループウェア）', value: 6667 },
  { name: 'BSSforALC（アルコール測定管理）', value: 5000 },
  { name: '新サービス（BPaaS等）', value: 2500 },
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
  { name: 'システム営業部', headcount: 19, productivity: 450 },
  { name: 'システム開発部', headcount: 30, productivity: 280 },
  { name: 'ユーザーサポート', headcount: 14, productivity: 230 },
  { name: 'コールセンター', headcount: 13, productivity: 210 },
  { name: '総務部', headcount: 4, productivity: 200 },
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
  { id: 'gbc',       shortName: 'GBC',       description: '運行管理システム',               color: '#3b82f6', currentArr: 12, targetArr2035: 35 },
  { id: 'gbcdr',     shortName: 'GBCDR',     description: '安全運転管理システム',           color: '#6366f1', currentArr: 5,  targetArr2035: 18 },
  { id: 'bss',       shortName: 'BSS',       description: '業種特化型グループウェア',       color: '#10b981', currentArr: 6,  targetArr2035: 20 },
  { id: 'bssforalc', shortName: 'BSSforALC', description: 'アルコール測定管理支援サービス', color: '#f59e0b', currentArr: 3,  targetArr2035: 12 },
  { id: 'new_svc',   shortName: '新サービス', description: 'BPaaS等の次世代サービス',       color: '#8b5cf6', currentArr: 1,  targetArr2035: 10 },
  { id: 'new_prod',  shortName: '新製品',     description: 'ハードウェア（OEM等）',         color: '#ef4444', currentArr: 0,  targetArr2035: 5  },
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
    title: 'SaaS型ビジネスモデルによる安定的な成長の実現',
    progress: 73,
    status: 'on_track',
    keyMetrics: [
      { label: '管理車両数', current: '95,000台', target: '130,000台（2030年）' },
      { label: '導入社数', current: '約10,000社', target: '13,000社（2030年）' },
      { label: '推定ARR', current: '27億円', target: '100億円（2035年）' },
    ],
    challenges: [
      '事業拡大に伴い、現社屋ではハード面（事業所面積）が不足',
      '導入社数増加に比例して現人員ではサポート・保守負担が増加する懸念',
    ],
    measures: [
      '主力サービス（BSS、BSS for ALC）のサポート体制（コールセンター等）の強化',
      '営業部署の人員増加により2030年には13,000社導入の確実な実現',
      '開発人員の増員による製品の内製比率を高め、サポート負荷を軽減',
    ],
  },
  {
    id: 'goal2', number: 2,
    title: '新サービス・新製品群による売上構成比の多角化',
    progress: 27,
    status: 'at_risk',
    keyMetrics: [
      { label: 'Denso売上集中度', current: '75%', target: '50%以下' },
      { label: 'NRR', current: '112%', target: '120%' },
      { label: '新サービスARR', current: '1億円', target: '10億円（2035年）' },
    ],
    challenges: [
      '既存プロダクトの付加価値増加',
      '新プロダクト開発にかかる初期投資負担の回収',
    ],
    measures: [
      'BPaaS（点呼・台帳・配車管理等の業務代行サービス）の本格展開',
      'AI・クラウドと連携した安全運転教育や車両稼働管理',
      'EV支援等を含む複合ソリューションの提供',
      'ハードウェアの自社ブランド製造（OEM等）',
    ],
  },
  {
    id: 'goal3', number: 3,
    title: 'マーケティング戦略の拡充及び人員増加による事業領域の拡張',
    progress: 55,
    status: 'at_risk',
    keyMetrics: [
      { label: '新規獲得', current: '80社/月', target: '100社/月' },
      { label: '従業員数', current: '80名', target: '90名（2026年度目標）' },
      { label: '商談化率', current: '30%', target: '35%' },
    ],
    challenges: [
      '市場浸透にはさらなる信頼性・導入実績が必要',
      '事業の根幹を担うシステム開発環境の早急な整備',
    ],
    measures: [
      '新社屋建設によるシステム開発部署の最適化された開発環境整備',
      '各部署への人員拡充を行い、部署ごとの対応力の大幅な向上',
      '自社の営業部員増加による販売力の強化',
      '展示会への参加、セミナー等の開催を積極的に行い、商品の認知度の向上',
      'ASEAN地域等への海外展開',
      'M&Aによる機能・販路強化',
    ],
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

// ===== 財務ダッシュボード モックデータ =====
import { MonthlyFinance, PaymentAlert, CostBreakdown } from '@/types';

// 月次 売上/コスト/利益（計画・実績・見込み）
export const MONTHLY_FINANCE: MonthlyFinance[] = [
  { month: '2026-01', label: '1月',  revenuePlan: 22500, revenueActual: 23100, revenueForecast: 23100, costPlan: 17800, costActual: 17200, costForecast: 17200, profitPlan: 4700, profitActual: 5900, profitForecast: 5900 },
  { month: '2026-02', label: '2月',  revenuePlan: 22800, revenueActual: 22400, revenueForecast: 22400, costPlan: 17900, costActual: 18300, costForecast: 18300, profitPlan: 4900, profitActual: 4100, profitForecast: 4100 },
  { month: '2026-03', label: '3月',  revenuePlan: 24500, revenueActual: 25800, revenueForecast: 25800, costPlan: 18500, costActual: 18100, costForecast: 18100, profitPlan: 6000, profitActual: 7700, profitForecast: 7700 },
  { month: '2026-04', label: '4月',  revenuePlan: 23000, revenueActual: 23500, revenueForecast: 23500, costPlan: 18000, costActual: 17800, costForecast: 17800, profitPlan: 5000, profitActual: 5700, profitForecast: 5700 },
  { month: '2026-05', label: '5月',  revenuePlan: 23200, revenueActual: null,  revenueForecast: 23800, costPlan: 18100, costActual: null,  costForecast: 17900, profitPlan: 5100, profitActual: null,  profitForecast: 5900 },
  { month: '2026-06', label: '6月',  revenuePlan: 23500, revenueActual: null,  revenueForecast: 24200, costPlan: 18200, costActual: null,  costForecast: 18000, profitPlan: 5300, profitActual: null,  profitForecast: 6200 },
  { month: '2026-07', label: '7月',  revenuePlan: 23800, revenueActual: null,  revenueForecast: 24500, costPlan: 18300, costActual: null,  costForecast: 18100, profitPlan: 5500, profitActual: null,  profitForecast: 6400 },
  { month: '2026-08', label: '8月',  revenuePlan: 23000, revenueActual: null,  revenueForecast: 23600, costPlan: 18100, costActual: null,  costForecast: 17900, profitPlan: 4900, profitActual: null,  profitForecast: 5700 },
  { month: '2026-09', label: '9月',  revenuePlan: 24000, revenueActual: null,  revenueForecast: 24800, costPlan: 18400, costActual: null,  costForecast: 18200, profitPlan: 5600, profitActual: null,  profitForecast: 6600 },
  { month: '2026-10', label: '10月', revenuePlan: 24200, revenueActual: null,  revenueForecast: 25000, costPlan: 18500, costActual: null,  costForecast: 18300, profitPlan: 5700, profitActual: null,  profitForecast: 6700 },
  { month: '2026-11', label: '11月', revenuePlan: 24500, revenueActual: null,  revenueForecast: 25300, costPlan: 18600, costActual: null,  costForecast: 18400, profitPlan: 5900, profitActual: null,  profitForecast: 6900 },
  { month: '2026-12', label: '12月', revenuePlan: 26000, revenueActual: null,  revenueForecast: 27000, costPlan: 19000, costActual: null,  costForecast: 18700, profitPlan: 7000, profitActual: null,  profitForecast: 8300 },
];

// 入金アラート
export const PAYMENT_ALERTS: PaymentAlert[] = [
  { id: 'pa-1', customer: 'デンソーテン株式会社', amount: 4500, dueDate: '2026-03-31', status: 'paid', invoiceNo: 'INV-2026-0301' },
  { id: 'pa-2', customer: '大和ハウス工業株式会社', amount: 1200, dueDate: '2026-04-15', status: 'overdue', invoiceNo: 'INV-2026-0402', daysPastDue: 21, note: '経理へ督促メール送付済み' },
  { id: 'pa-3', customer: '株式会社ゼンリン', amount: 800, dueDate: '2026-04-30', status: 'partial', invoiceNo: 'INV-2026-0410', note: '400万円入金済み、残額確認中' },
  { id: 'pa-4', customer: '佐川グローバルロジスティクス', amount: 2100, dueDate: '2026-05-10', status: 'upcoming', invoiceNo: 'INV-2026-0501' },
  { id: 'pa-5', customer: 'SBSホールディングス', amount: 950, dueDate: '2026-05-15', status: 'upcoming', invoiceNo: 'INV-2026-0502' },
  { id: 'pa-6', customer: 'トランスコスモス株式会社', amount: 680, dueDate: '2026-05-20', status: 'upcoming', invoiceNo: 'INV-2026-0503' },
  { id: 'pa-7', customer: '株式会社日立物流', amount: 3200, dueDate: '2026-05-31', status: 'upcoming', invoiceNo: 'INV-2026-0504' },
  { id: 'pa-8', customer: 'ヤマトシステム開発', amount: 1500, dueDate: '2026-03-25', status: 'overdue', invoiceNo: 'INV-2026-0305', daysPastDue: 42, note: '分割払い交渉中' },
];

// コスト内訳
export const COST_BREAKDOWN: CostBreakdown[] = [
  { category: '人件費', plan: 9800, actual: 9600, color: '#3b82f6' },
  { category: 'サーバー/クラウド', plan: 2800, actual: 3100, color: '#8b5cf6' },
  { category: '外注費', plan: 2200, actual: 2000, color: '#06b6d4' },
  { category: 'オフィス/設備', plan: 1500, actual: 1400, color: '#10b981' },
  { category: '営業・マーケ', plan: 1200, actual: 1100, color: '#f59e0b' },
  { category: 'その他', plan: 500, actual: 600, color: '#6b7280' },
];
