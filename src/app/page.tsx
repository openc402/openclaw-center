'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface StreamEntry { id: number; task_id: string; type: string; content: string; agent_id: string; created_at: string; }
interface AgentStatus { status: string; current_task: string; model: string; last_active: string; }
interface SubAgent { id: string; label: string; task: string; status: string; model: string; started_at: string; completed_at: string; result: string; }

const typeStyles: Record<string, { icon: string; color: string; bg: string }> = {
  start:    { icon: '🚀', color: 'text-green-400',  bg: 'border-l-green-500/50' },
  thought:  { icon: '💭', color: 'text-zinc-300',   bg: 'border-l-zinc-500/30' },
  action:   { icon: '⚡', color: 'text-blue-400',   bg: 'border-l-blue-500/50' },
  decision: { icon: '🧠', color: 'text-purple-400', bg: 'border-l-purple-500/50' },
  subtask:  { icon: '🔀', color: 'text-cyan-400',   bg: 'border-l-cyan-500/50' },
  result:   { icon: '✅', color: 'text-green-400',  bg: 'border-l-green-500/50' },
  error:    { icon: '❌', color: 'text-red-400',    bg: 'border-l-red-500/50' },
  end:      { icon: '🏁', color: 'text-yellow-400', bg: 'border-l-yellow-500/50' },
};

function timeStr(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function timeSince(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 5) return 'just now'; if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s/60)}m`; return `${Math.floor(s/3600)}h`;
}

export default function CommandCenter() {
  const [stream, setStream] = useState<StreamEntry[]>([]);
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastActiveAgo, setLastActiveAgo] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('agent_status').select('*').eq('id', 'main').single().then(({ data }) => { if (data) setAgent(data); });
    supabase.from('live_stream').select('*').order('created_at', { ascending: true }).limit(80).then(({ data }) => { if (data) setStream(data); });
    supabase.from('sub_agents').select('*').order('started_at', { ascending: false }).then(({ data }) => { if (data) setSubAgents(data); });
  }, []);

  useEffect(() => {
    const ch = supabase.channel('command-center')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_stream' }, (p) => {
        setStream(prev => [...prev.slice(-100), p.new as StreamEntry]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (p) => {
        setAgent(p.new as AgentStatus);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sub_agents' }, (p) => {
        setSubAgents(prev => [p.new as SubAgent, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sub_agents' }, (p) => {
        setSubAgents(prev => prev.map(sa => sa.id === (p.new as SubAgent).id ? p.new as SubAgent : sa));
      })
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [stream]);
  useEffect(() => {
    const i = setInterval(() => { if (agent?.last_active) setLastActiveAgo(timeSince(agent.last_active)); }, 1000);
    return () => clearInterval(i);
  }, [agent?.last_active]);

  const isWorking = agent?.status === 'working';
  const isOnline = agent?.status === 'online' || isWorking;
  const activeSubAgents = subAgents.filter(s => s.status === 'running');
  const recentSubAgents = subAgents.filter(s => s.status !== 'running').slice(0, 5);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <div>
          <h1 className="text-xl font-bold">🎛️ Live Feed</h1>
          <p className="text-zinc-600 text-xs">Supabase Realtime — watching me think</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'} ${connected ? 'animate-pulse' : ''}`} />
            <span className="text-[11px] text-zinc-600">{connected ? 'Live' : 'Connecting...'}</span>
          </div>
          <span className="text-[11px] text-zinc-700">{agent?.model}</span>
        </div>
      </div>

      {/* Status bar */}
      <div className={`glass p-2.5 mb-3 flex items-center justify-between ${isWorking ? 'border-purple-500/20' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isWorking ? 'bg-purple-400 animate-pulse' : isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${isWorking ? 'text-purple-300' : isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isWorking ? '🧠 Working' : isOnline ? 'Online' : 'Offline'}
          </span>
          {isWorking && agent?.current_task && <span className="text-xs text-zinc-500">— {agent.current_task}</span>}
        </div>
        <span className="text-[11px] text-zinc-700">Active {lastActiveAgo || '—'} ago</span>
      </div>

      {/* Main content: stream + sub-agents sidebar */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Live stream */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto glass p-3 space-y-0.5">
            {stream.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                <p className="text-4xl mb-3">🧠</p>
                <p className="font-medium text-sm">Waiting for activity...</p>
                <p className="text-xs mt-1">Thoughts appear here in real-time</p>
              </div>
            ) : (
              stream.map((entry) => {
                const style = typeStyles[entry.type] || typeStyles.thought;
                const isBookend = entry.type === 'start' || entry.type === 'end';
                return (
                  <div key={entry.id} className={`flex gap-2 items-start py-1 ${isBookend ? 'my-1.5' : ''}`}>
                    <span className="text-[10px] text-zinc-700 font-mono w-14 shrink-0 mt-0.5 hidden md:block">{timeStr(entry.created_at)}</span>
                    <div className={`flex-1 border-l-2 ${style.bg} pl-2.5`}>
                      <div className="flex items-start gap-1.5">
                        <span className="text-xs">{style.icon}</span>
                        <p className={`text-xs ${isBookend ? 'font-semibold' : ''} ${style.color}`}>{entry.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
          {isWorking && (
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-purple-400/70 px-1">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>thinking...</span>
            </div>
          )}
        </div>

        {/* Sub-agents panel - right side */}
        <div className="hidden lg:flex flex-col w-72 shrink-0">
          <div className="glass p-3 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-zinc-500 mb-3">🔀 SUB-AGENTS</h3>

            {/* Active */}
            {activeSubAgents.length > 0 && (
              <div className="space-y-2 mb-4">
                {activeSubAgents.map(sa => (
                  <div key={sa.id} className="glass-sm p-3 border-l-2 border-l-purple-500/50">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-xs font-medium text-purple-300">{sa.label || sa.id}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{sa.task}</p>
                    <p className="text-[10px] text-zinc-700 mt-1">{sa.model} · {timeSince(sa.started_at)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Recent completed */}
            {recentSubAgents.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-700 uppercase tracking-wider">Recent</p>
                {recentSubAgents.map(sa => (
                  <div key={sa.id} className={`glass-sm p-2.5 border-l-2 ${sa.status === 'completed' ? 'border-l-green-500/30' : 'border-l-red-500/30'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">{sa.status === 'completed' ? '✅' : '❌'}</span>
                      <span className="text-xs font-medium">{sa.label || sa.id}</span>
                    </div>
                    {sa.result && <p className="text-[11px] text-zinc-500">{sa.result}</p>}
                    <p className="text-[10px] text-zinc-700 mt-1">{timeSince(sa.completed_at || sa.started_at)}</p>
                  </div>
                ))}
              </div>
            )}

            {subAgents.length === 0 && (
              <p className="text-[11px] text-zinc-700 text-center mt-8">No sub-agents yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
