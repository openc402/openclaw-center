'use client';
import { AgentSession } from '@/types';

const statusConfig = {
  running: { color: 'bg-green-400', text: 'text-green-400', label: 'Running' },
  completed: { color: 'bg-blue-400', text: 'text-blue-400', label: 'Completed' },
  failed: { color: 'bg-red-400', text: 'text-red-400', label: 'Failed' },
  idle: { color: 'bg-zinc-500', text: 'text-zinc-500', label: 'Idle' },
};

export default function AgentPanel({ agents }: { agents: AgentSession[] }) {
  return (
    <div className="glass overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">🤖 Active Agents</h2>
        <p className="text-[11px] text-zinc-600">Sub-agents and their current tasks</p>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {agents.map((agent) => {
          const cfg = statusConfig[agent.status];
          return (
            <div key={agent.id} className="p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cfg.color} ${agent.status === 'running' ? 'live-dot' : ''}`} />
                  <span className="font-medium text-sm">{agent.label}</span>
                </div>
                <span className={`text-[11px] ${cfg.text}`}>{cfg.label}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-2">{agent.task}</p>
              <div className="flex gap-4 text-[11px] text-zinc-600">
                <span>🧠 {agent.model}</span>
                {agent.duration && <span>⏱ {agent.duration}</span>}
                {agent.tokensUsed ? <span>📊 {agent.tokensUsed.toLocaleString()} tokens</span> : null}
                {agent.cost && <span>💵 {agent.cost}</span>}
              </div>
              {agent.progress !== undefined && agent.progress > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${agent.progress}%` }} />
                  </div>
                </div>
              )}
              {agent.logs.length > 0 && (
                <div className="mt-3 space-y-1">
                  {agent.logs.slice(-3).map((log, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-zinc-600">{log.timestamp}</span>
                      <span className={
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'decision' ? 'text-amber-400' :
                        log.type === 'action' ? 'text-blue-400' : 'text-zinc-500'
                      }>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
