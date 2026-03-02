'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSetting } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([getSettings(), supabase.auth.getUser()]).then(([s, { data }]) => {
      setSettings(s);
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (key: string, value: any) => {
    await updateSetting(key, value);
    setSettings({ ...settings, [key]: value });
    setMessage('✅ Saved');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading settings...</div></div>;

  const notif = typeof settings.notifications === 'string' ? JSON.parse(settings.notifications) : (settings.notifications || {});

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">⚙️ Settings</h1>
        <p className="text-zinc-500 text-sm">Agent configuration — stored in Supabase</p>
      </div>

      {message && <div className="glass p-3 text-sm text-center text-green-400">{message}</div>}

      {/* Account */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">👤 Account</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Email</span>
            <span className="text-sm font-mono">{user?.email || '...'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">User ID</span>
            <span className="text-[11px] font-mono text-zinc-600">{user?.id || '...'}</span>
          </div>
        </div>
      </div>

      {/* Agent Config */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">🧠 Agent Configuration</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Model</p>
              <p className="text-xs text-zinc-600">AI model used for the main agent</p>
            </div>
            <select
              value={typeof settings.agent_model === 'string' ? settings.agent_model.replace(/"/g, '') : 'claude-opus-4-6'}
              onChange={(e) => handleUpdate('agent_model', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50">
              <option value="claude-opus-4-6">Claude Opus 4</option>
              <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
              <option value="claude-haiku-4">Claude Haiku 4</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Heartbeat Interval</p>
              <p className="text-xs text-zinc-600">Minutes between automatic check-ins</p>
            </div>
            <select
              value={settings.heartbeat_interval || 30}
              onChange={(e) => handleUpdate('heartbeat_interval', Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50">
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Timezone</p>
              <p className="text-xs text-zinc-600">Agent timezone for scheduling</p>
            </div>
            <span className="text-sm text-zinc-400 font-mono">{typeof settings.timezone === 'string' ? settings.timezone.replace(/"/g, '') : 'Europe/Paris'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Auto-Commit</p>
              <p className="text-xs text-zinc-600">Automatically commit workspace changes</p>
            </div>
            <button
              onClick={() => handleUpdate('auto_commit', settings.auto_commit === 'true' || settings.auto_commit === true ? false : true)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                settings.auto_commit === 'true' || settings.auto_commit === true
                  ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-zinc-500'
              }`}>
              {settings.auto_commit === 'true' || settings.auto_commit === true ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">🔔 Notifications</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Discord Notifications</p>
              <p className="text-xs text-zinc-600">Send alerts to Discord channel</p>
            </div>
            <button
              onClick={() => handleUpdate('notifications', { ...notif, discord: !notif.discord })}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                notif.discord ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-zinc-500'
              }`}>
              {notif.discord ? 'On' : 'Off'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm">Email Notifications</p>
              <p className="text-xs text-zinc-600">Send alerts via email</p>
            </div>
            <button
              onClick={() => handleUpdate('notifications', { ...notif, email: !notif.email })}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                notif.email ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-zinc-500'
              }`}>
              {notif.email ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">🗄️ Database</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Supabase Project</span>
            <span className="text-sm font-mono text-zinc-400">airdrop-farming</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Region</span>
            <span className="text-sm text-zinc-400">EU West</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Tables</span>
            <span className="text-sm text-zinc-400">agent_status, activity_log, goals, sub_agents, agent_settings</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="w-full glass p-4 text-red-400 hover:bg-red-500/10 rounded-2xl text-sm font-medium transition-all">
        🚪 Sign Out
      </button>
    </div>
  );
}
