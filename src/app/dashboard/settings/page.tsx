'use client';

import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: 'connected' | 'disconnected' | 'coming_soon';
  category: 'ai' | 'hr' | 'finance' | 'crm' | 'communication' | 'analytics';
  apiKeyField?: string;
  webhookUrl?: string;
  docs?: string;
  features: string[];
}

const INTEGRATIONS: Integration[] = [
  // === AI Providers ===
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 2.5 Flash — AI Advisorのデフォルトモデル。高速・低コスト',
    icon: 'G',
    color: '#4285f4',
    status: 'disconnected',
    category: 'ai',
    apiKeyField: 'GEMINI_API_KEY',
    docs: 'https://aistudio.google.com/apikey',
    features: [
      'AI Advisorチャット（Geminiモード）',
      '議事録AI分析（Geminiモード）',
      'Gemini 2.5 Flash — 高速応答・大コンテキスト',
      'Google AI Studioで無料キー取得可能',
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude Sonnet 4 / Haiku 4.5 — 高精度な分析・推論が必要な場合に',
    icon: 'C',
    color: '#d97706',
    status: 'disconnected',
    category: 'ai',
    apiKeyField: 'ANTHROPIC_API_KEY',
    docs: 'https://console.anthropic.com/settings/keys',
    features: [
      'AI Advisorチャット（Sonnet / Haikuモード）',
      '議事録AI分析（Sonnet / Haikuモード）',
      'Claude Sonnet 4 — 高精度な経営分析',
      'Claude Haiku 4.5 — 高速・低コスト',
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o / o3 — 汎用AI・推論モデル',
    icon: 'OA',
    color: '#10a37f',
    status: 'disconnected',
    category: 'ai',
    apiKeyField: 'OPENAI_API_KEY',
    docs: 'https://platform.openai.com/api-keys',
    features: [
      'AI Advisorチャット（GPT-4oモード）',
      '議事録AI分析（GPT-4oモード）',
      'GPT-4o — 高速マルチモーダル',
      'o3 — 深い推論・複雑な分析',
    ],
  },
  // === Business Integrations ===
  {
    id: 'herp',
    name: 'HERP Hire',
    description: '採用管理（ATS） — 候補者パイプライン、求人管理、選考進捗をリアルタイム連携',
    icon: 'H',
    color: '#4f46e5',
    status: 'disconnected',
    category: 'hr',
    apiKeyField: 'HERP_API_KEY',
    docs: 'https://developer.herp.cloud',
    features: [
      '候補者リスト・選考ステータス自動取得',
      '採用パイプライン（応募→書類→面接→内定）可視化',
      '求人ごとの応募数・通過率をKPIに反映',
      '採用リードタイム・内定承諾率の自動計算',
      'Webhook連携でリアルタイム更新',
    ],
  },
  {
    id: 'moneyforward',
    name: 'MoneyForward クラウド',
    description: '会計・請求書・経費 — 売上実績、コスト、入金状況を自動取得',
    icon: 'MF',
    color: '#0ea5e9',
    status: 'disconnected',
    category: 'finance',
    apiKeyField: 'MONEYFORWARD_API_KEY',
    docs: 'https://developer.moneyforward.com',
    features: [
      '売上・コスト実績の自動取得（CFOダッシュボード連携）',
      '請求書ステータス・入金アラート自動更新',
      '月次P/L・B/Sデータの自動集計',
      '経費申請・承認フローの可視化',
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM/SFA — 商談パイプライン、顧客管理、売上予測',
    icon: 'SF',
    color: '#00a1e0',
    status: 'coming_soon',
    category: 'crm',
    features: [
      '商談パイプライン・受注確度の可視化',
      '顧客別ARR・チャーンリスク分析',
      '営業KPI（新規獲得・商談化率）自動集計',
      'Denso集中度の自動計算',
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: '通知・アラート — KPIアラート、入金延滞、採用進捗をSlackへ自動通知',
    icon: 'S',
    color: '#e01e5a',
    status: 'coming_soon',
    category: 'communication',
    features: [
      'KPIステータス変更時の自動アラート',
      '入金延滞アラートをチャンネルへ通知',
      '週次KPIサマリーの自動投稿',
      'Decision Hub更新通知',
    ],
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Web分析 — プロダクトサイトのトラフィック・コンバージョンデータ',
    icon: 'GA',
    color: '#f59e0b',
    status: 'coming_soon',
    category: 'analytics',
    features: [
      'マーケティングKPI自動取得',
      'リード獲得チャネル別分析',
      'コンバージョンファネル可視化',
    ],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AIモデル',
  hr: '人事・採用',
  finance: '会計・財務',
  crm: '営業・顧客管理',
  communication: 'コミュニケーション',
  analytics: '分析・データ',
};

const AI_MODELS_IN_USE = [
  { provider: 'Gemini', model: 'gemini-2.5-flash', usage: 'AI Advisor (デフォルト) / 議事録AI分析', color: '#4285f4', active: true },
  { provider: 'Claude', model: 'claude-sonnet-4-20250514', usage: 'AI Advisor (Sonnetモード)', color: '#d97706', active: true },
  { provider: 'Claude', model: 'claude-haiku-4-5-20251001', usage: 'AI Advisor (Haikuモード)', color: '#16a34a', active: true },
  { provider: 'OpenAI', model: 'gpt-4o', usage: 'AI Advisor (GPT-4oモード) — 対応準備中', color: '#10a37f', active: false },
  { provider: 'OpenAI', model: 'o3', usage: 'AI Advisor (o3推論モード) — 対応準備中', color: '#10a37f', active: false },
];

const STATUS_CONFIG = {
  connected: { label: '接続済み', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  disconnected: { label: '未接続', color: 'text-[var(--text-tertiary)]', bg: 'bg-[var(--hover-bg)]', border: 'border-[var(--border)]' },
  coming_soon: { label: '準備中', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function SettingsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  const handleSave = (id: string) => {
    // Demo: just show saved state
    setSavedKeys(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setSavedKeys(prev => ({ ...prev, [id]: false })), 2000);
  };

  const categories = [...new Set(INTEGRATIONS.map(i => i.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
          外部サービス連携・システム設定
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            CEO専用
          </span>
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">連携サービス</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{INTEGRATIONS.length}</p>
          <p className="text-xs mt-1 text-[var(--text-tertiary)]">対応予定</p>
        </div>
        <div className="rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/5 shadow-[var(--shadow-card)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">接続済み</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{INTEGRATIONS.filter(i => i.status === 'connected').length}</p>
          <p className="text-xs mt-1 text-emerald-400">稼働中</p>
        </div>
        <div className="rounded-xl p-4 border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">設定可能</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{INTEGRATIONS.filter(i => i.status === 'disconnected').length}</p>
          <p className="text-xs mt-1 text-[var(--text-tertiary)]">APIキー設定待ち</p>
        </div>
        <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5 shadow-[var(--shadow-card)]">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">開発中</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{INTEGRATIONS.filter(i => i.status === 'coming_soon').length}</p>
          <p className="text-xs mt-1 text-blue-400">近日対応</p>
        </div>
      </div>

      {/* Active AI Models */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] p-5">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          現在使用中のAIモデル
        </h3>
        <div className="space-y-2">
          {AI_MODELS_IN_USE.map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)] border border-[var(--border)]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: m.color }}>
                {m.provider[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{m.provider}</span>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--card-bg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    {m.model}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{m.usage}</p>
              </div>
              <div className="shrink-0">
                {m.active ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--hover-bg)] text-[var(--text-tertiary)] border border-[var(--border)] font-medium">
                    準備中
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-tertiary)] mt-3">
          モデル切替はAI Advisorパネル内のプロバイダーボタン（Gemini / Sonnet / Haiku）で行えます。
          APIキーが未設定のプロバイダーは利用可能な他のプロバイダーにフォールバックします。
        </p>
      </div>

      {/* Integration List by Category */}
      {categories.map(cat => (
        <div key={cat}>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {CATEGORY_LABELS[cat]}
          </h2>
          <div className="space-y-3">
            {INTEGRATIONS.filter(i => i.category === cat).map(integration => {
              const isExpanded = expandedId === integration.id;
              const status = STATUS_CONFIG[integration.status];
              return (
                <div key={integration.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : integration.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-[var(--hover-bg)] transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: integration.color }}>
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{integration.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.bg} ${status.border} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">{integration.description}</p>
                    </div>
                    <svg className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-[var(--border)]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        {/* Features */}
                        <div>
                          <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2">連携機能</h4>
                          <ul className="space-y-1.5">
                            {integration.features.map((f, i) => (
                              <li key={i} className="text-xs text-[var(--text-tertiary)] flex items-start gap-2">
                                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Config */}
                        <div>
                          {integration.status === 'coming_soon' ? (
                            <div className="rounded-lg p-4 bg-blue-500/5 border border-blue-500/20">
                              <p className="text-xs text-blue-400 font-medium">開発中</p>
                              <p className="text-[11px] text-blue-300/70 mt-1">
                                この連携機能は現在開発中です。リリース時にお知らせします。
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-[var(--text-secondary)]">接続設定</h4>

                              {/* API Key */}
                              {integration.apiKeyField && (
                                <div>
                                  <label className="text-[11px] text-[var(--text-tertiary)] mb-1 block">
                                    APIキー ({integration.apiKeyField})
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="password"
                                      placeholder="sk-xxxx..."
                                      value={apiKeys[integration.id] || ''}
                                      onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                      className="flex-1 px-3 py-2 rounded-lg bg-[var(--hover-bg)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-blue-500/50"
                                    />
                                    <button
                                      onClick={() => handleSave(integration.id)}
                                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        savedKeys[integration.id]
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                                      }`}
                                    >
                                      {savedKeys[integration.id] ? '保存済み' : '保存'}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Webhook URL */}
                              <div>
                                <label className="text-[11px] text-[var(--text-tertiary)] mb-1 block">
                                  Webhook URL（{integration.name}側に設定）
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value={`https://kpios-v16.vercel.app/api/webhook/${integration.id}`}
                                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--hover-bg)] border border-[var(--border)] text-xs text-[var(--text-tertiary)] font-mono"
                                  />
                                  <button
                                    onClick={() => navigator.clipboard.writeText(`https://kpios-v16.vercel.app/api/webhook/${integration.id}`)}
                                    className="px-3 py-2 rounded-lg text-xs font-medium bg-[var(--hover-bg)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
                                  >
                                    コピー
                                  </button>
                                </div>
                              </div>

                              {/* Sync Settings */}
                              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--hover-bg)] border border-[var(--border)]">
                                <div>
                                  <p className="text-xs text-[var(--text-primary)] font-medium">自動同期</p>
                                  <p className="text-[10px] text-[var(--text-tertiary)]">1時間ごとにデータを自動取得</p>
                                </div>
                                <div className="w-8 h-4 rounded-full bg-[var(--border)] cursor-pointer">
                                  <div className="w-3 h-3 rounded-full bg-white translate-x-0.5 translate-y-0.5" />
                                </div>
                              </div>

                              {/* Docs Link */}
                              {integration.docs && (
                                <a href={integration.docs} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                  APIドキュメント
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Data Policy Note */}
      <div className="rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-yellow-400">データセキュリティ</h4>
            <p className="text-xs text-yellow-300/70 mt-0.5 leading-relaxed">
              APIキーはVercel環境変数として暗号化保存されます。外部APIとの通信はすべてTLS暗号化され、データはサーバーサイドでのみ処理されます。
              クライアント側にAPIキーが露出することはありません。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
