'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AgentStatus { id: string; name: string; status: string; current_task: string; model: string; last_active: string; uptime_start: string; }
interface SubAgent { id: string; label: string; task: string; status: string; model: string; runtime: string; started_at: string; completed_at: string; result: string; }
interface StreamEntry { id: number; task_id: string; type: string; content: string; agent_id: string; created_at: string; }

const typeStyles: Record<string, { icon: string; color: string }> = {
  start: { icon: '🚀', color: 'text-green-400' }, thought: { icon: '💭', color: 'text-zinc-300' },
  action: { icon: '⚡', color: 'text-blue-400' }, decision: { icon: '🧠', color: 'text-purple-400' },
  subtask: { icon: '🔀', color: 'text-cyan-400' }, result: { icon: '✅', color: 'text-green-400' },
  error: { icon: '❌', color: 'text-red-400' }, end: { icon: '🏁', color: 'text-yellow-400' },
};

function timeSince(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 5) return 'just now'; if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s/60)}m`; return `${Math.floor(s/3600)}h`;
}

export default function AgentsPage() {
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [agentStream, setAgentStream] = useState<StreamEntry[]>([]);
  const [loadingStream, setLoadingStream] = useState(false);
  const [connected, setConnected] = useState(false);

  // Initial load
  useEffect(() => {
    supabase.from('agent_status').select('*').eq('id', 'main').single().then(({ data }) => { if (data) setAgent(data); });
    supabase.from('sub_agents').select('*').order('started_at', { ascending: false }).then(({ data }) => { if (data) setSubAgents(data); });
  }, []);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel('agents-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (p) => setAgent(p.new as AgentStatus))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sub_agents' }, (p) => setSubAgents(prev => [p.new as SubAgent, ...prev]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sub_agents' }, (p) => setSubAgents(prev => prev.map(sa => sa.id === (p.new as SubAgent).id ? p.new as SubAgent : sa)))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'sub_agents' }, (p) => setSubAgents(prev => prev.filter(sa => sa.id !== (p.old as any).id)))
      // Live stream for expanded sub-agent
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_stream' }, (p) => {
        const entry = p.new as StreamEntry;
        if (entry.agent_id && entry.agent_id !== 'main') {
          setAgentStream(prev => [...prev, entry]);
        }
      })
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Load stream for a sub-agent
  const toggleExpand = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    setLoadingStream(true);
    const { data } = await supabase.from('live_stream').select('*').eq('agent_id', id).order('created_at', { ascending: true });
    setAgentStream(data || []);
    setLoadingStream(false);
  };

  const isWorking = agent?.status === 'working';
  const isOnline = agent?.status === 'online' || isWorking;
  const uptime = agent?.uptime_start ? Math.floor((Date.now() - new Date(agent.uptime_start).getTime()) / 3600000) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🤖 Agents</h1>
          <p className="text-zinc-500 text-sm">Real-time agent & sub-agent monitoring</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-[11px] text-zinc-600">{connected ? 'Live' : '...'}</span>
        </div>
      </div>

      {/* Main agent */}
      <div className={`glass p-5 ${isWorking ? 'border-purple-500/20' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isWorking ? 'bg-purple-500/15' : isOnline ? 'bg-green-500/15' : 'bg-red-500/15'}`}>⚡</div>
            <div>
              <h2 className="text-lg font-bold">{agent?.name || 'Main Agent'}</h2>
              <p className="text-zinc-500 text-xs">{agent?.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isWorking ? 'bg-purple-400 animate-pulse' : isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`font-medium text-sm ${isWorking ? 'text-purple-300' : isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isWorking ? 'Working' : agent?.status || 'unknown'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Current Task', value: agent?.current_task || 'Idle', color: 'text-blue-400' },
            { label: 'Uptime', value: `${uptime}h`, color: 'text-yellow-400' },
            { label: 'Last Active', value: agent?.last_active ? timeSince(agent.last_active) + ' ago' : '—', color: '' },
            { label: 'Sub-agents', value: String(subAgents.filter(s => s.status === 'running').length) + ' active', color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="glass-sm p-3">
              <p className="text-[10px] text-zinc-600">{s.label}</p>
              <p className={`text-sm font-medium mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-agents */}
      <div>
        <h2 className="text-lg font-semibold mb-3">🔀 Sub-Agents <span className="text-[10px] text-green-400 ml-1">LIVE</span></h2>
        {subAgents.length === 0 ? (
          <div className="glass p-8 text-center text-zinc-600">
            <p className="text-3xl mb-3">🔀</p>
            <p className="text-sm">No sub-agents. They appear here in real-time when spawned.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {subAgents.map((sa) => {
              const isRunning = sa.status === 'running';
              const isExpanded = expanded === sa.id;
              return (
                <div key={sa.id} className={`glass overflow-hidden ${isRunning ? 'border-purple-500/15' : ''}`}>
                  {/* Header - clickable */}
                  <button onClick={() => toggleExpand(sa.id)} className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-purple-400 animate-pulse' : sa.status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-sm font-medium">{sa.label || sa.id}</p>
                        <p className="text-xs text-zinc-500">{sa.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                      <span>{sa.model || '—'}</span>
                      <span className={`px-2 py-0.5 rounded-full ${isRunning ? 'badge-upcoming' : sa.status === 'completed' ? 'badge-active' : 'badge-ended'}`}>
                        {sa.status}
                      </span>
                      <span>{timeSince(sa.started_at)}</span>
                      <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </button>

                  {/* Expanded: result + thought stream */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/20">
                      {/* Result if completed */}
                      {sa.result && (
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Result</p>
                          <p className="text-sm text-green-400">{sa.result}</p>
                        </div>
                      )}

                      {/* Thought stream */}
                      <div className="p-4">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Thought Stream</p>
                        {loadingStream ? (
                          <p className="text-zinc-700 text-xs">Loading...</p>
                        ) : agentStream.length === 0 ? (
                          <p className="text-zinc-700 text-xs">
                            {isRunning ? 'Waiting for thoughts...' : 'No stream data for this agent'}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {agentStream.map((e) => {
                              const st = typeStyles[e.type] || typeStyles.thought;
                              return (
                                <div key={e.id} className="flex gap-2 items-start">
                                  <span className="text-[10px] text-zinc-700 font-mono w-14 shrink-0 hidden sm:block">
                                    {new Date(e.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </span>
                                  <span className="text-xs">{st.icon}</span>
                                  <p className={`text-xs ${st.color}`}>{e.content}</p>
                                </div>
                              );
                            })}
                            {isRunning && (
                              <div className="flex items-center gap-1.5 text-[11px] text-purple-400/50 mt-2">
                                <div className="flex gap-0.5">
                                  <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" />
                                  <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span>thinking...</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
