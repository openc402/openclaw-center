'use client';

import { useEffect, useState } from 'react';
import { getActivityLog } from '@/lib/api';

const catIcons: Record<string, string> = {
  setup: '🔧', build: '🏗️', deploy: '🚀', database: '🗄️', farming: '🤖', chat: '💬', error: '❌', system: '⚙️',
};
const catColors: Record<string, string> = {
  setup: 'border-blue-500/30', build: 'border-purple-500/30', deploy: 'border-green-500/30',
  database: 'border-yellow-500/30', farming: 'border-cyan-500/30', chat: 'border-pink-500/30',
  error: 'border-red-500/30', system: 'border-zinc-500/30',
};

export default function ReplayPage() {
  const [log, setLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getActivityLog(100).then(l => { setLog(l); setLoading(false); });
  }, []);

  const categories = ['all', ...new Set(log.map(l => l.category).filter(Boolean))];
  const filtered = filter === 'all' ? log : log.filter(l => l.category === filter);

  // Group by date
  const grouped: Record<string, any[]> = {};
  for (const entry of filtered) {
    const date = new Date(entry.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  }

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading replay...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⏪ Replay</h1>
        <p className="text-zinc-500 text-sm">Full activity timeline — every action logged</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === c ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
            }`}>
            {c === 'all' ? '📋 All' : `${catIcons[c] || '📌'} ${c}`}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-zinc-500 mb-3 sticky top-0 bg-[#07070d] py-2 z-10">{date}</h3>
            <div className="space-y-2 ml-2 border-l-2 border-white/5">
              {entries.map((entry) => (
                <div key={entry.id} className={`ml-4 glass p-4 border-l-2 ${catColors[entry.category] || 'border-zinc-500/30'}`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{catIcons[entry.category] || '📌'}</span>
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        {entry.details && <p className="text-xs text-zinc-500 mt-0.5">{entry.details}</p>}
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-600 whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
