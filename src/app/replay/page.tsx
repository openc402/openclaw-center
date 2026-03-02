'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TaskSession {
  id: string;
  title: string;
  summary: string;
  status: string;
  category: string;
  started_at: string;
  ended_at: string;
}

interface StreamEntry {
  id: number;
  task_id: string;
  type: string;
  content: string;
  created_at: string;
}

const typeStyles: Record<string, { icon: string; color: string }> = {
  start: { icon: '🚀', color: 'text-green-400' },
  thought: { icon: '💭', color: 'text-zinc-300' },
  action: { icon: '⚡', color: 'text-blue-400' },
  decision: { icon: '🧠', color: 'text-purple-400' },
  subtask: { icon: '🔀', color: 'text-cyan-400' },
  result: { icon: '✅', color: 'text-green-400' },
  error: { icon: '❌', color: 'text-red-400' },
  end: { icon: '🏁', color: 'text-yellow-400' },
};

function duration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

export default function ReplayPage() {
  const [sessions, setSessions] = useState<TaskSession[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [entries, setEntries] = useState<StreamEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    supabase.from('task_sessions').select('*').order('started_at', { ascending: false }).limit(50)
      .then(({ data }) => { setSessions(data || []); setLoading(false); });
  }, []);

  const toggleSession = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    setLoadingEntries(true);
    const { data } = await supabase.from('live_stream').select('*')
      .eq('task_id', id).order('created_at', { ascending: true });
    setEntries(data || []);
    setLoadingEntries(false);
  };

  // Group sessions by date
  const grouped: Record<string, TaskSession[]> = {};
  for (const s of sessions) {
    const date = new Date(s.started_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(s);
  }

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading replay...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⏪ Replay</h1>
        <p className="text-zinc-500 text-sm">Click on a task to see the full thought process</p>
      </div>

      {sessions.length === 0 ? (
        <div className="glass p-8 text-center text-zinc-500">
          <p className="text-4xl mb-4">⏪</p>
          <p className="font-medium">No task sessions yet</p>
          <p className="text-xs mt-2 text-zinc-600">Completed tasks will appear here with full replay</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dateSessions]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-zinc-500 mb-3 capitalize">{date}</h3>
              <div className="space-y-2">
                {dateSessions.map((s) => (
                  <div key={s.id} className="glass overflow-hidden">
                    {/* Task header - clickable */}
                    <button
                      onClick={() => toggleSession(s.id)}
                      className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${s.status === 'completed' ? '' : 'animate-pulse'}`}>
                          {s.status === 'completed' ? '✅' : '🔄'}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{s.title}</p>
                          {s.summary && <p className="text-xs text-zinc-500 mt-0.5">{s.summary}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                        {s.ended_at && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5">
                            ⏱ {duration(s.started_at, s.ended_at)}
                          </span>
                        )}
                        <span>
                          {new Date(s.started_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`transition-transform ${expanded === s.id ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>

                    {/* Expanded: full thought stream */}
                    {expanded === s.id && (
                      <div className="border-t border-white/5 p-4 bg-black/20">
                        {loadingEntries ? (
                          <p className="text-zinc-600 text-sm">Loading thoughts...</p>
                        ) : entries.length === 0 ? (
                          <p className="text-zinc-600 text-sm">No stream entries for this task</p>
                        ) : (
                          <div className="space-y-1.5">
                            {entries.map((e) => {
                              const st = typeStyles[e.type] || typeStyles.thought;
                              return (
                                <div key={e.id} className="flex gap-2 items-start">
                                  <span className="text-[11px] text-zinc-700 font-mono w-16 shrink-0 mt-0.5 hidden sm:block">
                                    {new Date(e.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </span>
                                  <span className="text-sm">{st.icon}</span>
                                  <p className={`text-sm ${st.color}`}>{e.content}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
