'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ROLE_DASHBOARDS } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import AiChatButton from '@/components/AiChat/AiChatButton';
import AiChatPanel from '@/components/AiChat/AiChatPanel';

const NAV_ITEMS: { id: string; label: string; href: string }[] = [
  { id: 'CEO', label: 'CEO', href: '/dashboard' },
  { id: 'CFO', label: 'CFO', href: '/dashboard/cfo' },
  { id: 'Sales', label: 'Sales', href: '/dashboard/sales' },
  { id: 'CS', label: 'CS', href: '/dashboard/cs' },
  { id: 'HR', label: 'HR', href: '/dashboard/hr' },
  { id: 'Ops', label: 'Ops', href: '/dashboard/ops' },
  { id: 'Decisions', label: 'Decisions', href: '/dashboard/decisions' },
  { id: 'Simulator', label: 'Simulator', href: '/dashboard/simulator' },
  { id: 'Minutes', label: 'Minutes', href: '/dashboard/minutes' },
  { id: 'Settings', label: 'Settings', href: '/dashboard/settings' },
];

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const allowed = user ? ROLE_DASHBOARDS[user.role] : [];
  const visibleItems = NAV_ITEMS.filter((item) => allowed.includes(item.id));

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="text-base font-semibold text-[var(--text-primary)]">
              KPIOS <span className="text-blue-500">v16</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-500'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* AI Advisor */}
            <AiChatButton onClick={() => setChatOpen(true)} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all"
              aria-label="テーマ切替"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>

            {/* User menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:block text-sm text-[var(--text-secondary)]">{user.role}</span>
                  <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl z-50 p-1">
                      <div className="px-3 py-2 border-b border-[var(--border)]">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[var(--hover-bg)] rounded-lg mt-1"
                      >
                        ログアウト
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--hover-bg)]"
              aria-label="メニュー"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--nav-bg)]">
          <nav className="px-4 py-3 space-y-1">
            {visibleItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-500'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>

    <AiChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
