import { supabase } from './supabase';

// ========== AGENT STATUS ==========
export async function getAgentStatus() {
  const { data } = await supabase.from('agent_status').select('*').eq('id', 'main').single();
  return data;
}

export async function updateAgentStatus(updates: Record<string, any>) {
  await supabase.from('agent_status').update({ ...updates, last_active: new Date().toISOString() }).eq('id', 'main');
}

// ========== ACTIVITY LOG ==========
export async function getActivityLog(limit = 50) {
  const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export async function logActivity(action: string, category: string, details?: string, metadata?: Record<string, any>) {
  await supabase.from('activity_log').insert({ action, category, details, metadata: metadata || {} });
}

// ========== GOALS ==========
export async function getGoals() {
  const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: true });
  return data || [];
}

export async function addGoal(goal: { title: string; description?: string; parent_id?: string; priority?: string; due_date?: string }) {
  const { data } = await supabase.from('goals').insert(goal).select().single();
  return data;
}

export async function updateGoal(id: string, updates: Record<string, any>) {
  await supabase.from('goals').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
}

export async function deleteGoal(id: string) {
  await supabase.from('goals').delete().eq('id', id);
}

// ========== SUB-AGENTS ==========
export async function getSubAgents() {
  const { data } = await supabase.from('sub_agents').select('*').order('started_at', { ascending: false });
  return data || [];
}

// ========== SETTINGS ==========
export async function getSettings() {
  const { data } = await supabase.from('agent_settings').select('*');
  const settings: Record<string, any> = {};
  for (const row of (data || [])) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateSetting(key: string, value: any) {
  await supabase.from('agent_settings').upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
}
