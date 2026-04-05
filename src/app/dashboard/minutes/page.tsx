'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { parseMinutes, ParsedMinutes, ExtractedAction } from '@/lib/minutes-parser';

type Mode = 'rule' | 'ai';
type Provider = 'gemini' | 'anthropic' | 'anthropic-haiku';

interface AiResult {
  text: string;
}

function ActionRow({ action, idx }: { action: ExtractedAction; idx: number }) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="py-2 px-3 text-sm">{idx + 1}</td>
      <td className="py-2 px-3 text-sm text-[var(--text-primary)]">{action.content}</td>
      <td className="py-2 px-3 text-sm">
        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs">{action.owner}</span>
      </td>
      <td className="py-2 px-3 text-sm">
        <span className={`px-2 py-0.5 rounded-md text-xs ${action.deadline === '未定' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          {action.deadline}
        </span>
      </td>
      <td className="py-2 px-3 text-sm">
        {action.relatedKpi ? (
          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono">{action.relatedKpi}</span>
        ) : (
          <span className="text-[var(--text-tertiary)] text-xs">—</span>
        )}
      </td>
    </tr>
  );
}

function RuleResults({ result }: { result: ParsedMinutes }) {
  return (
    <div className="space-y-6">
      {/* 決定事項 */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-xs">✓</span>
          決定事項（{result.decisions.length}件）
        </h3>
        {result.decisions.length > 0 ? (
          <ul className="space-y-1.5">
            {result.decisions.map((d, i) => (
              <li key={i} className="text-sm text-[var(--text-primary)] bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--text-tertiary)]">決定事項が見つかりませんでした</p>
        )}
      </div>

      {/* ネクストアクション */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-blue-500/15 flex items-center justify-center text-blue-400 text-xs">→</span>
          ネクストアクション（{result.actions.length}件）
        </h3>
        {result.actions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--hover-bg)] text-xs text-[var(--text-tertiary)]">
                  <th className="py-2 px-3 w-8">#</th>
                  <th className="py-2 px-3">アクション</th>
                  <th className="py-2 px-3 w-24">担当</th>
                  <th className="py-2 px-3 w-20">期限</th>
                  <th className="py-2 px-3 w-32">関連KPI</th>
                </tr>
              </thead>
              <tbody>
                {result.actions.map((a, i) => (
                  <ActionRow key={i} action={a} idx={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-tertiary)]">アクションが見つかりませんでした</p>
        )}
      </div>

      {/* 未決定事項 */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-yellow-500/15 flex items-center justify-center text-yellow-400 text-xs">?</span>
          未決定・持ち越し（{result.pending.length}件）
        </h3>
        {result.pending.length > 0 ? (
          <ul className="space-y-1.5">
            {result.pending.map((p, i) => (
              <li key={i} className="text-sm text-[var(--text-primary)] bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2">
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--text-tertiary)]">未決定事項はありません</p>
        )}
      </div>
    </div>
  );
}

function AiResults({ text }: { text: string }) {
  // Simple markdown-ish rendering
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm text-[var(--text-primary)] leading-relaxed">
      {lines.map((line, i) => {
        if (line.match(/^\*\*【.*】\*\*$|^【.*】$/)) {
          return <h3 key={i} className="text-sm font-semibold mt-4 mb-2 text-blue-400">{line.replace(/\*\*/g, '')}</h3>;
        }
        if (line.match(/^- \[ \]/)) {
          return <div key={i} className="flex gap-2 ml-2 py-0.5"><span className="text-[var(--text-tertiary)]">☐</span><span>{line.slice(5)}</span></div>;
        }
        if (line.match(/^- /)) {
          return <div key={i} className="flex gap-2 ml-2 py-0.5"><span className="text-[var(--text-tertiary)]">•</span><span>{line.slice(2)}</span></div>;
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        // Bold
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
          part.startsWith('**') ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong> : part
        );
        return <div key={i}>{parts}</div>;
      })}
    </div>
  );
}

export default function MinutesPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('rule');
  const [ruleResult, setRuleResult] = useState<ParsedMinutes | null>(null);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>('gemini');

  const analyze = useCallback(async () => {
    if (!input.trim()) return;
    setError(null);

    if (mode === 'rule') {
      const result = parseMinutes(input);
      setRuleResult(result);
      setAiResult(null);
    } else {
      setLoading(true);
      setRuleResult(null);
      setAiResult({ text: '' });
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user' as const,
              content: `以下の議事録からネクストアクションを抽出してください。\n\n${input}`,
            }],
            userRole: user?.role ?? 'CEO',
            provider,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream');

        const decoder = new TextDecoder();
        let accumulated = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setAiResult({ text: accumulated });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
  }, [input, mode, user, provider]);

  const sampleMinutes = `【経営会議 議事録】
日時：2026年4月3日（金）10:00-11:30
出席者：尾田専務、財務部長、営業部長、CS部長、Ops部長

■ 議題1：Denso依存度の改善施策
・現状75%→目標50%まで引き下げが急務
・営業部長より：直販チャネル強化として、物流業界向け専任チームを4月中に立ち上げる
・パートナー候補3社と5月末までにアライアンス契約を目指す
→ 決定：直販チーム3名体制で4/15始動。営業部長がリード。

■ 議題2：ハイリスクアカウント12社への対応
・CS部長より：12社中5社はレスキュープラン実行済み、残り7社が未着手
・A社（MRR 280万円）とB社（MRR 210万円）は来月更新のため最優先
→ 決定：A社・B社は今週中に訪問。CS部長＋営業部長の同行で対応。
→ 決定：残り5社は4/15までにレスキュープラン発動。

■ 議題3：SLA違反率の改善
・現状8%（目標3%）、3ヶ月連続で悪化傾向
・Ops部長より：コールセンターの人員不足が主因。現在13名→15名に増員提案
→ 決定：派遣2名を4月中に投入。正社員2名の採用も並行。HR部長と連携。

■ 議題4：BPaaS新サービスの進捗
・開発部より：β版が6月リリース予定だが、テスト工数が不足
→ 未決定：QA外注の予算承認は次回会議で判断。CFOが費用対効果を整理。`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">議事録アクション抽出</h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">会議メモからネクストアクション・決定事項を自動抽出</p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-0.5">
          <button
            onClick={() => setMode('rule')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'rule'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            ルールベース
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'ai'
                ? 'bg-blue-500/15 text-blue-400'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            AI分析
          </button>
        </div>
      </div>

      {/* Mode description */}
      <div className={`mb-4 px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
        mode === 'rule'
          ? 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80'
          : 'bg-blue-500/5 border border-blue-500/10 text-blue-400/80'
      }`}>
        <span>
          {mode === 'rule'
            ? 'キーワードマッチで抽出（API不要・即時・データ外部送信なし）'
            : `${provider === 'gemini' ? 'Gemini' : provider === 'anthropic' ? 'Sonnet' : 'Haiku'} AIで高精度分析（API使用・KPI影響分析付き）`
          }
        </span>
        {mode === 'ai' && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setProvider('gemini')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                provider === 'gemini' ? 'bg-blue-500/15 text-blue-400' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Gemini
            </button>
            <button
              onClick={() => setProvider('anthropic')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                provider === 'anthropic' ? 'bg-orange-500/15 text-orange-400' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Sonnet
            </button>
            <button
              onClick={() => setProvider('anthropic-haiku')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                provider === 'anthropic-haiku' ? 'bg-green-500/15 text-green-400' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Haiku
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--text-primary)]">議事録入力</label>
            <button
              onClick={() => setInput(sampleMinutes)}
              className="text-[10px] px-2 py-1 rounded-md border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-all"
            >
              サンプル挿入
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="議事録・会議メモをここに貼り付けてください..."
            className="w-full h-[400px] lg:h-[500px] resize-none rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono leading-relaxed"
          />
          <button
            onClick={analyze}
            disabled={!input.trim() || loading}
            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40"
          >
            {loading ? '分析中...' : mode === 'rule' ? 'ルールベースで抽出' : 'AI分析を実行'}
          </button>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-sm font-medium text-[var(--text-primary)] mb-2">抽出結果</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 min-h-[400px] lg:min-h-[500px] overflow-y-auto">
            {!ruleResult && !aiResult && (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-12 h-12 rounded-2xl bg-[var(--hover-bg)] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">左に議事録を入力して分析を実行してください</p>
              </div>
            )}
            {ruleResult && <RuleResults result={ruleResult} />}
            {aiResult && <AiResults text={aiResult.text} />}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
