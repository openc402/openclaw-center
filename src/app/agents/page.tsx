'use client';

import { useEffect, useState } from 'react';
import { getAgentStatus, getSubAgents } from '@/lib/api';

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function AgentsPage() {
  const [agent, setAgent] = useState<any>(null);
  const [subAgents, setSubAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAgentStatus(), getSubAgents()]).then(([a, s]) => {
      setAgent(a); setSubAgents(s); setLoading(false);
    });
    const i = setInterval(async () => {
      const [a, s] = await Promise.all([getAgentStatus(), getSubAgents()]);
      setAgent(a); setSubAgents(s);
    }, 15000);
    return () => clearInterval(i);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading agents...</div></div>;

  const isOnline = agent?.status === 'online';
  const uptime = agent?.uptime_start ? Math.floor((Date.now() - new Date(agent.uptime_start).getTime()) / 3600000) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🤖 Agents</h1>
        <p className="text-zinc-500 text-sm">Main agent & sub-agents overview</p>
      </div>

      {/* Main agent */}
      <div className="glass p-5 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isOnline ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold">{agent?.name || 'Main Agent'}</h2>
              <p className="text-zinc-500 text-sm">{agent?.model || 'unknown'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{agent?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-sm p-3">
            <p className="text-xs text-zinc-600">Current Task</p>
            <p className="text-sm font-medium mt-1">{agent?.current_task || 'Idle'}</p>
          </div>
          <div className="glass-sm p-3">
            <p className="text-xs text-zinc-600">Uptime</p>
            <p className="text-sm font-medium mt-1 text-yellow-400">{uptime}h</p>
          </div>
          <div className="glass-sm p-3">
            <p className="text-xs text-zinc-600">Last Active</p>
            <p className="text-sm font-medium mt-1">{agent?.last_active ? timeAgo(agent.last_active) : '—'}</p>
          </div>
          <div className="glass-sm p-3">
            <p className="text-xs text-zinc-600">Sessions</p>
            <p className="text-sm font-medium mt-1">{agent?.session_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Sub-agents */}
      <div>
        <h2 className="text-lg font-semibold mb-4">🔀 Sub-Agents</h2>
        {subAgents.length === 0 ? (
          <div className="glass p-8 text-center text-zinc-500">
            <p className="text-4xl mb-4">🤖</p>
            <p className="font-medium">No sub-agents</p>
            <p className="text-xs mt-2 text-zinc-600">Sub-agents appear here when I spawn them for parallel tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subAgents.map((sa) => (
              <div key={sa.id} className="glass p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{sa.label || sa.id}</h3>
                    <p className="text-xs text-zinc-500">{sa.runtime || 'subagent'} · {sa.model || '—'}</p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                    sa.status === 'running' ? 'badge-upcoming' : sa.status === 'completed' ? 'badge-active' : 'badge-ended'
                  }`}>{sa.status}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-3">{sa.task}</p>
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>Started: {sa.started_at ? timeAgo(sa.started_at) : '—'}</span>
                  {sa.completed_at && <span>Completed: {timeAgo(sa.completed_at)}</span>}
                </div>
                {sa.result && (
                  <div className="mt-3 p-2 bg-white/5 rounded-lg text-xs text-zinc-400 max-h-20 overflow-y-auto">
                    {sa.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
