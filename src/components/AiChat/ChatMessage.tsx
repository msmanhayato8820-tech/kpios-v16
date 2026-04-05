'use client';

import { ReactNode } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

function renderMarkdown(text: string): ReactNode[] {
  return text.split('\n').map((line, i) => {
    // Bold
    let parts: ReactNode[] = [line];
    const boldRegex = /\*\*(.+?)\*\*/g;
    if (boldRegex.test(line)) {
      parts = [];
      let lastIdx = 0;
      const fresh = /\*\*(.+?)\*\*/g;
      let match;
      while ((match = fresh.exec(line)) !== null) {
        if (match.index > lastIdx) parts.push(line.slice(lastIdx, match.index));
        parts.push(<strong key={`b-${i}-${match.index}`} className="font-semibold">{match[1]}</strong>);
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < line.length) parts.push(line.slice(lastIdx));
    }

    // Bullet points
    if (line.match(/^[-•]\s/)) {
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-[var(--text-tertiary)]">•</span>
          <span>{parts.length === 1 ? (line.slice(2)) : parts.slice(1)}</span>
        </div>
      );
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1];
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-[var(--text-tertiary)] min-w-[1.2em]">{num}.</span>
          <span>{parts.length === 1 ? line.replace(/^\d+\.\s/, '') : parts}</span>
        </div>
      );
    }

    // Empty line
    if (line.trim() === '') return <div key={i} className="h-2" />;

    return <div key={i}>{parts}</div>;
  });
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-500/15 text-[var(--text-primary)] rounded-br-md'
            : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-md'
        }`}
      >
        {isUser ? content : renderMarkdown(content)}
      </div>
    </div>
  );
}
