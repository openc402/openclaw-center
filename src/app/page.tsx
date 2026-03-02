'use client';

import { useEffect, useState } from 'react';
import { getAgentStatus, getActivityLog, getGoals, getSubAgents } from '@/lib/api';

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const catIcons: Record<string, string> = {
  setup: '🔧', build: '🏗️', deploy: '🚀', database: '🗄️', farming: '🤖', chat: '💬', error: '❌', system: '⚙️',
};

export default function CommandCenter() {
  const [agent, setAgent] = useState<any>(null);
  const [log, setLog] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [subAgents, setSubAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [a, l, g, s] = await Promise.all([getAgentStatus(), getActivityLog(20), getGoals(), getSubAgents()]);
    setAgent(a);
    setLog(l);
    setGoals(g);
    setSubAgents(s);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 15000); // Poll every 15s
    return () => clearInterval(i);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500 flex items-center gap-3"><div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />Loading agent data...</div></div>;

  const topGoals = goals.filter(g => !g.parent_id);
  const uptime = agent?.uptime_start ? Math.floor((Date.now() - new Date(agent.uptime_start).getTime()) / 3600000) : 0;
  const isOnline = agent?.status === 'online';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold">🎛️ Command Center</h1>
          <p className="text-zinc-500 text-sm">Real-time agent operations — auto-refresh 15s</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: 'Status', value: agent?.status || 'unknown', icon: '🟢', color: 'text-green-400' },
          { title: 'Model', value: agent?.model || '—', icon: '🧠', color: 'text-purple-400' },
          { title: 'Current Task', value: agent?.current_task || 'Idle', icon: '⚡', color: 'text-blue-400' },
          { title: 'Uptime', value: `${uptime}h`, icon: '⏱️', color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.title} className="glass p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-zinc-600 text-xs">{s.title}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`text-sm font-semibold ${s.color} truncate`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 glass p-4 md:p-5">
          <h2 className="font-semibold mb-4">📋 Activity Feed <span className="text-[10px] text-green-400 ml-1">LIVE</span></h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {log.map((entry) => (
              <div key={entry.id} className="flex gap-3 items-start">
                <span className="text-lg mt-0.5">{catIcons[entry.category] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{entry.action}</p>
                  {entry.details && <p className="text-xs text-zinc-500 truncate">{entry.details}</p>}
                </div>
                <span className="text-[11px] text-zinc-600 whitespace-nowrap">{timeAgo(entry.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals summary */}
        <div className="glass p-4 md:p-5">
          <h2 className="font-semibold mb-4">🎯 Active Goals</h2>
          <div className="space-y-4">
            {topGoals.map((g) => {
              const children = goals.filter(c => c.parent_id === g.id);
              const completed = children.filter(c => c.status === 'completed').length;
              return (
                <div key={g.id}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium">{g.title}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      g.status === 'completed' ? 'badge-active' : g.status === 'active' ? 'badge-upcoming' : 'badge-ended'
                    }`}>{g.progress}%</span>
                  </div>
                  {children.length > 0 && (
                    <p className="text-[11px] text-zinc-600 mb-1">{completed}/{children.length} sub-tasks done</p>
                  )}
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-agents */}
      <div className="glass p-4 md:p-5">
        <h2 className="font-semibold mb-4">🤖 Sub-Agents</h2>
        {subAgents.length === 0 ? (
          <p className="text-zinc-600 text-sm">No sub-agents running. They appear here when spawned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subAgents.map((sa) => (
              <div key={sa.id} className="glass-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{sa.label || sa.id}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    sa.status === 'running' ? 'badge-upcoming' : sa.status === 'completed' ? 'badge-active' : 'badge-ended'
                  }`}>{sa.status}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{sa.task}</p>
                <div className="flex justify-between mt-2 text-[11px] text-zinc-600">
                  <span>{sa.model || '—'}</span>
                  <span>{sa.started_at ? timeAgo(sa.started_at) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
