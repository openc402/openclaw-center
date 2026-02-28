import { SessionStats } from '@/types';

export default function StatsBar({ stats }: { stats: SessionStats }) {
  const items = [
    { label: 'Tokens', value: stats.totalTokens.toLocaleString(), icon: '📊' },
    { label: 'Cost', value: stats.totalCost, icon: '💵' },
    { label: 'Duration', value: stats.sessionDuration, icon: '⏱' },
    { label: 'Actions', value: String(stats.actionsCount), icon: '⚡' },
    { label: 'Agents', value: String(stats.agentsSpawned), icon: '🤖' },
    { label: 'Files', value: String(stats.filesEdited), icon: '📝' },
    { label: 'Commands', value: String(stats.commandsRun), icon: '⌨️' },
  ];

  return (
    <div className="glass p-3 flex items-center justify-between gap-2 overflow-x-auto">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] min-w-fit">
          <span className="text-sm">{item.icon}</span>
          <div>
            <p className="text-[10px] text-zinc-600">{item.label}</p>
            <p className="text-sm font-semibold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
