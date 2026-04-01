'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ROLE_DASHBOARDS } from '@/lib/auth';

const NAV_ITEMS: { id: string; label: string; icon: string; href: string }[] = [
  { id: 'CEO', label: 'CEO統合', icon: '🎯', href: '/dashboard' },
  { id: 'CFO', label: 'CFO財務', icon: '📈', href: '/dashboard/cfo' },
  { id: 'Sales', label: 'Sales営業', icon: '💰', href: '/dashboard/sales' },
  { id: 'CS', label: 'CS', icon: '🤝', href: '/dashboard/cs' },
  { id: 'HR', label: 'HR人事', icon: '👥', href: '/dashboard/hr' },
  { id: 'Ops', label: 'Ops運用', icon: '🔧', href: '/dashboard/ops' },
  { id: 'Simulator', label: 'シミュレーター', icon: '🚀', href: '/dashboard/simulator' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const allowed = user ? ROLE_DASHBOARDS[user.role] : [];

  const visibleItems = NAV_ITEMS.filter((item) => allowed.includes(item.id));

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">
          KPIOS <span className="text-blue-400">v16</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">アネストシステム</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm text-blue-400 font-medium">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-200 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-xs text-gray-500 hover:text-gray-300 py-1.5 rounded border border-gray-800 hover:border-gray-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}
    </aside>
  );
}
