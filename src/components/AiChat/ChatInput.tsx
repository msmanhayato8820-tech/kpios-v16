'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  showSuggestions: boolean;
}

const SUGGESTIONS = [
  '今月のARR成長率は？',
  'チャーン率が高い理由は？',
  'Denso依存度を下げるには？',
  'P0アクションの進捗は？',
  '議事録を貼り付けてアクション抽出',
];

export default function ChatInput({ onSend, disabled, showSuggestions }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border)] p-3 bg-[var(--nav-bg)]">
      {showSuggestions && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTIONS.map((s) => {
            const isMinutes = s.includes('議事録');
            return (
              <button
                key={s}
                onClick={() => {
                  if (isMinutes) {
                    onSend('以下に議事録を貼り付けます。決定事項・ネクストアクション・未決定事項を抽出し、関連KPIへの影響も分析してください。\n\n（ここに議事録を貼り付けてください）');
                  } else {
                    onSend(s);
                  }
                }}
                disabled={disabled}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-all disabled:opacity-50 ${
                  isMinutes
                    ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="KPIについて質問する..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all disabled:opacity-40 disabled:hover:bg-blue-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
