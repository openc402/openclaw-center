'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Command Center', icon: '🎛️' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/goals', label: 'Goal Tracker', icon: '🎯' },
  { href: '/airdrops', label: 'Airdrops', icon: '🪂' },
  { href: '/farming', label: 'Farming', icon: '⚡' },
  { href: '/wallet', label: 'Wallet', icon: '💰' },
  { href: '/gas', label: 'Gas Tracker', icon: '⛽' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 glass border-r border-white/5 flex flex-col z-50">
      <div className="p-5 border-b border-white/5">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="text-purple-400 text-xl">⚡</span>
          <span>OpenClaw</span>
        </h1>
        <p className="text-[11px] text-zinc-600 mt-0.5">Command Center</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active ? 'bg-purple-500/15 text-purple-300 font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5">
        <div className="glass-sm p-3 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            <span className="text-zinc-500">Main Agent</span>
          </div>
          <p className="text-green-400 font-medium text-[11px]">Online — Active</p>
        </div>
      </div>
    </aside>
  );
}
