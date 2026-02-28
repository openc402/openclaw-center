import { mockFarmingTasks } from '@/data/mock';

const typeIcons: Record<string, string> = { bridge: '🌉', swap: '🔄', liquidity: '💧', interact: '🔗', stake: '🥩', other: '📦' };
const statusIcons: Record<string, string> = { pending: '⏳', running: '🔄', completed: '✅', failed: '❌' };

export default function FarmingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⚡ Auto-Farming</h1>
        <p className="text-zinc-500 text-sm">Automated on-chain tasks</p>
      </div>
      <div className="glass overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-zinc-600 border-b border-white/5">
              <th className="text-left p-4">Task</th>
              <th className="text-left p-4">Airdrop</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Frequency</th>
              <th className="text-left p-4">Last Run</th>
            </tr>
          </thead>
          <tbody>
            {mockFarmingTasks.map((t) => (
              <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="p-4 text-sm">{t.description}</td>
                <td className="p-4 text-sm text-zinc-400">{t.airdrop_name}</td>
                <td className="p-4 text-sm">{typeIcons[t.task_type]} {t.task_type}</td>
                <td className="p-4 text-sm">{statusIcons[t.status]} {t.status}</td>
                <td className="p-4 text-sm text-zinc-400">{t.frequency}</td>
                <td className="p-4 text-sm text-zinc-500">{t.last_run ? new Date(t.last_run).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
