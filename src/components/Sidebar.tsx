'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const nav = [
  { href: '/', label: 'Command Center', icon: '🎛️' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/goals', label: 'Goal Tracker', icon: '🎯' },
  { href: '/replay', label: 'Replay', icon: '⏪' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { if (isMobile) setOpen(false); }, [pathname, isMobile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      {isMobile && (
        <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-[60] p-2 glass rounded-xl" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      )}

      {isMobile && open && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-screen w-60 glass border-r border-white/5 flex flex-col z-50 transition-transform duration-200 ${
        isMobile && !open ? '-translate-x-full' : 'translate-x-0'
      }`}>
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
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="glass-sm p-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-zinc-500">Main Agent</span>
            </div>
            <p className="text-green-400 font-medium text-[11px]">Online — Active</p>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-all">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
