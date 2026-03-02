'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface StreamEntry {
  id: number;
  task_id: string;
  type: string;
  content: string;
  created_at: string;
}

interface AgentStatus {
  status: string;
  current_task: string;
  model: string;
  last_active: string;
}

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

function timeStr(date: string) {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function timeSince(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function CommandCenter() {
  const [stream, setStream] = useState<StreamEntry[]>([]);
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [lastActiveAgo, setLastActiveAgo] = useState('');

  // Load initial data
  useEffect(() => {
    // Fetch agent status
    supabase.from('agent_status').select('*').eq('id', 'main').single()
      .then(({ data }) => { if (data) setAgent(data); });

    // Fetch recent stream (last 50 entries)
    supabase.from('live_stream').select('*').order('created_at', { ascending: true }).limit(50)
      .then(({ data }) => { if (data) setStream(data); });
  }, []);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase.channel('live-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_stream' }, (payload) => {
        setStream(prev => [...prev.slice(-100), payload.new as StreamEntry]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agent_status' }, (payload) => {
        setAgent(payload.new as AgentStatus);
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stream]);

  // Update "last active" display every second
  useEffect(() => {
    const i = setInterval(() => {
      if (agent?.last_active) setLastActiveAgo(timeSince(agent.last_active));
    }, 1000);
    return () => clearInterval(i);
  }, [agent?.last_active]);

  const isWorking = agent?.status === 'working';
  const isOnline = agent?.status === 'online' || isWorking;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-bold">🎛️ Live Feed</h1>
          <p className="text-zinc-500 text-sm">Supabase Realtime — watching me think</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-[11px] text-zinc-600">{connected ? 'Realtime connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Agent status bar */}
      <div className={`glass p-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${isWorking ? 'border-purple-500/20' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isWorking ? 'bg-purple-400 animate-pulse' : isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
          <div>
            <span className={`text-sm font-medium ${isWorking ? 'text-purple-300' : isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isWorking ? '🧠 Working' : isOnline ? 'Online' : 'Offline'}
            </span>
            {isWorking && agent?.current_task && (
              <span className="text-xs text-zinc-500 ml-2">— {agent.current_task}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-zinc-600">
          <span>{agent?.model || '—'}</span>
          <span>Last active: {lastActiveAgo || '—'}</span>
        </div>
      </div>

      {/* Stream */}
      <div className="flex-1 overflow-y-auto glass p-3 md:p-4 space-y-1">
        {stream.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <p className="text-4xl mb-4">🧠</p>
            <p className="font-medium">Waiting for agent activity...</p>
            <p className="text-xs mt-2">Thoughts will appear here in real-time when I start working</p>
            {isOnline && <p className="text-xs mt-1 text-green-400/50">Agent is online — ready to receive tasks</p>}
          </div>
        ) : (
          stream.map((entry) => {
            const style = typeStyles[entry.type] || typeStyles.thought;
            const isBookend = entry.type === 'start' || entry.type === 'end';
            return (
              <div key={entry.id} className={`flex gap-2 md:gap-3 items-start py-1.5 ${isBookend ? 'my-2' : ''}`}>
                <span className="text-[11px] text-zinc-700 font-mono w-16 md:w-20 shrink-0 mt-0.5 hidden sm:block">
                  {timeStr(entry.created_at)}
                </span>
                <div className={`flex-1 border-l-2 ${style.bg} pl-3 ${isBookend ? 'py-1' : ''}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{style.icon}</span>
                    <p className={`text-sm ${isBookend ? 'font-semibold' : ''} ${style.color}`}>
                      {entry.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator when working */}
      {isWorking && (
        <div className="mt-2 flex items-center gap-2 text-xs text-purple-400/70 px-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>thinking...</span>
        </div>
      )}
    </div>
  );
}
