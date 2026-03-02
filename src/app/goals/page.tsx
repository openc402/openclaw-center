'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Goal { id: string; parent_id: string | null; title: string; description: string; status: string; progress: number; priority: string; due_date: string; }

const priorityColors: Record<string, string> = { high: 'text-red-400', medium: 'text-yellow-400', low: 'text-green-400' };

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newParent, setNewParent] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  // Initial load
  useEffect(() => {
    supabase.from('goals').select('*').order('created_at', { ascending: true })
      .then(({ data }) => { setGoals(data || []); setLoading(false); });
  }, []);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel('goals-page')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'goals' }, (p) => setGoals(prev => [...prev, p.new as Goal]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'goals' }, (p) => setGoals(prev => prev.map(g => g.id === (p.new as Goal).id ? p.new as Goal : g)))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'goals' }, (p) => setGoals(prev => prev.filter(g => g.id !== (p.old as any).id)))
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); };
  }, []);

  const topGoals = goals.filter(g => !g.parent_id);
  const childrenOf = (id: string) => goals.filter(g => g.parent_id === id);

  const handleAdd = async () => {
    if (!newTitle) return;
    await supabase.from('goals').insert({ title: newTitle, description: newDesc || null, parent_id: newParent || null, priority: newPriority });
    setNewTitle(''); setNewDesc(''); setNewParent(''); setShowAdd(false);
  };

  const handleToggle = async (g: Goal) => {
    const newStatus = g.status === 'completed' ? 'active' : 'completed';
    await supabase.from('goals').update({ status: newStatus, progress: newStatus === 'completed' ? 100 : 0, updated_at: new Date().toISOString() }).eq('id', g.id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('goals').delete().eq('id', id);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading goals...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold">🎯 Goal Tracker</h1>
          <p className="text-zinc-500 text-sm">Live updates via Supabase Realtime</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-[11px] text-zinc-600">{connected ? 'Live' : '...'}</span>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            + Add Goal
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="glass p-5 space-y-3">
          <input type="text" placeholder="Goal title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
          <input type="text" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
          <div className="flex gap-3">
            <select value={newParent} onChange={e => setNewParent(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
              <option value="">Top-level goal</option>
              {topGoals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
              <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Save</button>
            <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-zinc-300 px-4 py-2.5 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topGoals.map((g) => {
          const children = childrenOf(g.id);
          const completed = children.filter(c => c.status === 'completed').length;
          return (
            <div key={g.id} className="glass p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="flex items-start gap-3">
                  <button onClick={() => handleToggle(g)} className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all ${
                    g.status === 'completed' ? 'border-green-400 bg-green-400/20 text-green-400' : 'border-zinc-600 hover:border-purple-400'
                  }`}>{g.status === 'completed' ? '✓' : ''}</button>
                  <div>
                    <h3 className={`font-semibold ${g.status === 'completed' ? 'line-through text-zinc-600' : ''}`}>{g.title}</h3>
                    {g.description && <p className="text-xs text-zinc-500 mt-0.5">{g.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${priorityColors[g.priority] || 'text-zinc-400'}`}>{g.priority}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${g.status === 'completed' ? 'badge-active' : 'badge-upcoming'}`}>{g.progress}%</span>
                  <button onClick={() => handleDelete(g.id)} className="text-zinc-700 hover:text-red-400 text-xs">✕</button>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
              </div>
              {children.length > 0 && (
                <div className="space-y-2 ml-8">
                  <p className="text-[11px] text-zinc-600">{completed}/{children.length} completed</p>
                  {children.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 py-1">
                      <button onClick={() => handleToggle(c)} className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-all ${
                        c.status === 'completed' ? 'border-green-400 bg-green-400/20 text-green-400' : 'border-zinc-700 hover:border-purple-400'
                      }`}>{c.status === 'completed' ? '✓' : ''}</button>
                      <span className={`text-sm flex-1 ${c.status === 'completed' ? 'line-through text-zinc-600' : 'text-zinc-400'}`}>{c.title}</span>
                      <button onClick={() => handleDelete(c.id)} className="text-zinc-700 hover:text-red-400 text-[11px]">✕</button>
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
