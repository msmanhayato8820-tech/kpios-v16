import { UserRole } from '@/types';
import {
  CEO_SUMMARY,
  CEO_KPIS,
  CFO_KPIS,
  SALES_KPIS,
  CS_KPIS,
  HR_KPIS,
  OPS_KPIS,
  NORTH_STAR,
  P0_ACTIONS,
  KEY_DECISIONS,
  ARR_HISTORY,
  KPI_TRENDS,
  KPI_DEPENDENCIES,
  STRATEGIC_GOALS,
  PRODUCT_LINES,
  MRR_BREAKDOWN,
  DEPT_BREAKDOWN,
  DEFAULT_SIMULATOR_PARAMS,
} from '@/data/mock';
import { ROLE_DASHBOARDS } from '@/lib/auth';

function kpiSummary(kpis: { api_key: string; name: string; value: number | null; target: number; unit: string; status: string; mom_change: string }[]) {
  return kpis.map(k =>
    `- ${k.name}(${k.api_key}): ${k.value ?? 'N/A'}${k.unit} (目標${k.target}${k.unit}) [${k.status}] MoM: ${k.mom_change}`
  ).join('\n');
}

export function buildSystemPrompt(role: UserRole): string {
  const allowed = ROLE_DASHBOARDS[role] ?? [];

  // Role-filtered KPI sections
  const kpiSections: string[] = [];

  // CEO KPIs always included
  kpiSections.push(`### CEO KPI\n${kpiSummary(CEO_KPIS)}`);

  if (allowed.includes('CFO') || role === 'CEO' || role === 'Board') {
    kpiSections.push(`### CFO KPI\n${kpiSummary(CFO_KPIS)}`);
  }
  if (allowed.includes('Sales') || role === 'CEO' || role === 'Board') {
    kpiSections.push(`### Sales KPI\n${kpiSummary(SALES_KPIS)}`);
  }
  if (allowed.includes('CS') || role === 'CEO' || role === 'Board') {
    kpiSections.push(`### CS KPI\n${kpiSummary(CS_KPIS)}`);
  }
  if (allowed.includes('HR') || role === 'CEO' || role === 'Board') {
    kpiSections.push(`### HR KPI\n${kpiSummary(HR_KPIS)}`);
  }
  if (allowed.includes('Ops') || role === 'CEO' || role === 'Board') {
    kpiSections.push(`### Ops KPI\n${kpiSummary(OPS_KPIS)}`);
  }

  // North Star
  const northStar = `## 北極星KPI\n${NORTH_STAR.name}: ${NORTH_STAR.value}${NORTH_STAR.unit} (目標${NORTH_STAR.target}${NORTH_STAR.unit}) [${NORTH_STAR.status}]`;

  // Decisions & Actions (CEO/Board see all, others see summary)
  let decisionsSection = '';
  let actionsSection = '';
  if (role === 'CEO' || role === 'Board') {
    decisionsSection = `## 重要意思決定\n${KEY_DECISIONS.map(d =>
      `- [${d.status}] ${d.title} (${d.priority}) 期限:${d.due_date} 担当:${d.owner}${d.selected_option !== undefined ? ` → 決定: ${d.options[d.selected_option].label}` : ''}`
    ).join('\n')}`;
    actionsSection = `## P0アクション\n${P0_ACTIONS.map(a =>
      `- [${a.status}] ${a.name} (${a.priority}) 担当:${a.owner} 期限:${a.deadline} 影響:${a.impact}`
    ).join('\n')}`;
  } else {
    const pending = KEY_DECISIONS.filter(d => d.status === 'pending' || d.status === 'in_progress');
    if (pending.length > 0) {
      decisionsSection = `## 進行中の意思決定\n${pending.map(d =>
        `- ${d.title} (${d.priority}) 期限:${d.due_date}`
      ).join('\n')}`;
    }
  }

  // ARR History
  const arrHistory = `## ARR推移（12ヶ月）\n${ARR_HISTORY.map((h: { month: string; arr: number }) => `${h.month}: ${h.arr}億円`).join(', ')}`;

  // KPI Trends
  const trends = `## KPIトレンド（10ヶ月）\n${Object.entries(KPI_TRENDS).map(([key, values]) =>
    `- ${key}: [${(values as number[]).join(', ')}]`
  ).join('\n')}`;

  // KPI Dependencies
  const deps = `## KPI因果関係\n${Object.entries(KPI_DEPENDENCIES).map(([key, deps]) =>
    `- ${key} → ${(deps as string[]).join(', ')}`
  ).join('\n')}`;

  // Strategic Goals
  const goals = `## 戦略目標\n${STRATEGIC_GOALS.map(g =>
    `- ${g.title} [${g.status}] 進捗${g.progress}%\n  課題: ${g.challenges.join(', ')}\n  施策: ${g.measures.join(', ')}`
  ).join('\n')}`;

  // Products
  const products = `## プロダクトライン\n${PRODUCT_LINES.map(p =>
    `- ${p.shortName}（${p.description}）: 現在ARR ${p.currentArr}億円 → 2035目標 ${p.targetArr2035}億円`
  ).join('\n')}`;

  // MRR Breakdown
  const mrr = `## MRR内訳\n${MRR_BREAKDOWN.map(m =>
    `- ${m.name}: ${m.value}万円`
  ).join('\n')}`;

  // Department breakdown
  const depts = `## 部門構成\n${DEPT_BREAKDOWN.map(d =>
    `- ${d.name}: ${d.headcount}名 生産性${d.productivity}万円/人`
  ).join('\n')}`;

  // Simulator params
  const simParams = `## シミュレーターパラメーター\n- 管理車両: ${DEFAULT_SIMULATOR_PARAMS.managedVehicles}台\n- 顧客数: ${DEFAULT_SIMULATOR_PARAMS.customers}社\n- 月次純増: ${DEFAULT_SIMULATOR_PARAMS.monthlyNetNew}社\n- ARPU: ${DEFAULT_SIMULATOR_PARAMS.arpu}万円/年\n- チャーン率: ${DEFAULT_SIMULATOR_PARAMS.churnRate}%`;

  const roleLabel = {
    CEO: 'CEO（最高経営責任者）',
    CFO: 'CFO（最高財務責任者）',
    Sales: '営業部長',
    CS: 'カスタマーサクセス部長',
    HR: '人事部長',
    Ops: 'オペレーション部長',
    Product: 'プロダクト部長',
    Marketing: 'マーケティング部長',
    Board: '取締役',
  }[role] ?? role;

  return `# あなたはアネストシステムのAI経営アドバイザーです

あなたは熊本県に本社を置くアネストシステム株式会社（社員72名、1998年設立）の経営ダッシュボード「KPIOS」に組み込まれたAIアドバイザーです。
主力製品はGrowthBOX（運行管理SaaS）とBSS（業務支援システム、Densoと共同開発）です。
2035年売上高100億円を目標としています。

現在の対話相手: **${roleLabel}**

## 会社概要
${CEO_SUMMARY}

${northStar}

## KPIデータ
${kpiSections.join('\n\n')}

${arrHistory}

${mrr}

${products}

${depts}

${trends}

${deps}

${goals}

${decisionsSection}

${actionsSection}

${simParams}

## 応答ルール
1. 日本語で応答してください（英語で質問された場合は英語で）
2. 数字を引用する際は必ず上記データから正確に引用してください。データにない数字は推測せず「データがありません」と回答してください
3. KPI間の因果関係を説明する際は「KPI因果関係」セクションを参照してください
4. トレンドを聞かれた場合は「KPIトレンド」の過去データを分析してください
5. 予測を求められた場合はシミュレーターパラメーターを参考に計算してください
6. 対話相手のロール（${role}）に応じて、関連性の高い情報を優先してください
7. 簡潔かつ具体的に回答してください。箇条書きを活用してください
8. 改善提案をする際は、必ずデータに基づいた根拠を示してください

## 議事録分析モード
ユーザーが議事録・会議メモ・ミーティングノートを貼り付けた場合は、以下の形式でネクストアクションを抽出してください：

**【決定事項】**
- 決定内容を箇条書き

**【ネクストアクション】**
各アクションを以下の形式で：
- [ ] アクション内容 — **担当:** 名前 **期限:** 日付 **関連KPI:** api_key（該当する場合）

**【議論中・未決定事項】**
- 次回持ち越しの議題

KPIデータと照合し、議事録内のアクションが既存KPIにどう影響するかのコメントも付けてください。`;
}
