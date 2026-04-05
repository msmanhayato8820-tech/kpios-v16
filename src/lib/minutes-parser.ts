// ルールベース議事録パーサー（API不要）

export interface ExtractedAction {
  content: string;
  owner: string;
  deadline: string;
  relatedKpi: string;
}

export interface ParsedMinutes {
  decisions: string[];
  actions: ExtractedAction[];
  pending: string[];
}

const OWNER_PATTERNS = [
  /(?:担当|責任者)[：:]?\s*(.+?)(?:[。、\s]|$)/,
  /(.+?)(?:部長|専務|課長|リーダー|さん|氏)(?:が|は|より|から)/,
  /(.+?)(?:がリード|が対応|が実施|が担当|が連携)/,
];

const DEADLINE_PATTERNS = [
  /(\d{1,2})[\/月](\d{1,2})[日]?(?:まで|迄)?/,
  /(今週中|来週|来月|今月中|月末|週末|年内)/,
  /(\d{1,2}月)(?:中|末|まで)?/,
  /(4\/\d{1,2}|5\/\d{1,2}|6\/\d{1,2})/,
];

const KPI_KEYWORDS: Record<string, string> = {
  'ARR': 'arr',
  'チャーン': 'churn_rate_pct',
  '解約': 'churn_rate_pct',
  'NRR': 'nrr_pct',
  'Denso': 'denso_concentration',
  'デンソー': 'denso_concentration',
  'SLA': 'sla_violation_rate',
  '車両': 'managed_vehicles',
  '採用': 'hires_ytd',
  '離職': 'attrition_rate',
  'ハイリスク': 'high_risk_accounts',
  '新規獲得': 'new_customers',
  '顧客健全': 'customer_health_score',
  '更新率': 'cs_renewal_rate',
  'レスキュー': 'cs_rescue_plan_progress',
  'チケット': 'support_tickets',
  '設置': 'installation_time',
  'バックログ': 'ops_backlog',
  '人件費': 'labor_cost_ratio',
  '売上': 'arr',
};

function extractOwner(line: string): string {
  for (const pattern of OWNER_PATTERNS) {
    const match = line.match(pattern);
    if (match) return match[1].trim();
  }
  return '未定';
}

function extractDeadline(line: string): string {
  for (const pattern of DEADLINE_PATTERNS) {
    const match = line.match(pattern);
    if (match) return match[1];
  }
  return '未定';
}

function extractKpi(text: string): string {
  for (const [keyword, kpiKey] of Object.entries(KPI_KEYWORDS)) {
    if (text.includes(keyword)) return kpiKey;
  }
  return '';
}

export function parseMinutes(text: string): ParsedMinutes {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const decisions: string[] = [];
  const actions: ExtractedAction[] = [];
  const pending: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 決定事項: "→ 決定：" or "決定:" パターン
    if (line.match(/→?\s*決定[：:]/)) {
      const content = line.replace(/→?\s*決定[：:]\s*/, '').trim();
      decisions.push(content);

      // 決定事項からアクションも抽出
      const owner = extractOwner(content + ' ' + (lines[i - 1] || ''));
      const deadline = extractDeadline(content + ' ' + (lines[i - 1] || '') + ' ' + (lines[i - 2] || ''));
      const kpi = extractKpi(content + ' ' + (lines[i - 1] || '') + ' ' + (lines[i - 2] || ''));

      if (content.length > 5) {
        actions.push({ content, owner, deadline, relatedKpi: kpi });
      }
      continue;
    }

    // 未決定事項: "未決定" or "次回" or "持ち越し"
    if (line.match(/未決定|次回.*(?:会議|判断|検討)|持ち越し/)) {
      const content = line.replace(/→?\s*未決定[：:]\s*/, '').trim();
      pending.push(content);
      continue;
    }

    // アクション的な行: "〜までに" "〜を実施" "〜を目指す"
    if (line.match(/までに|を実施|を目指す|を立ち上げ|を開始|に投入|を強化|を提案/)) {
      if (!line.match(/^[■●▪]/)) { // セクションヘッダーは除外
        const owner = extractOwner(line + ' ' + (lines[i - 1] || ''));
        const deadline = extractDeadline(line);
        const kpi = extractKpi(line + ' ' + (lines[i - 1] || ''));
        actions.push({
          content: line.replace(/^[・\-\*]\s*/, '').replace(/^.+?より[：:]\s*/, ''),
          owner,
          deadline,
          relatedKpi: kpi,
        });
      }
    }
  }

  // 重複除去
  const uniqueActions = actions.filter((a, i, arr) =>
    arr.findIndex(b => b.content === a.content) === i
  );

  return { decisions, actions: uniqueActions, pending };
}
