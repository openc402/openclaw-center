import { mockAirdrops } from '@/data/mock';

export default function AirdropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🪂 Airdrops</h1>
        <p className="text-zinc-500 text-sm">Tracked airdrops and farming opportunities</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAirdrops.map((a) => (
          <div key={a.id} className="glass p-5 hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{a.name}</h3>
                <p className="text-zinc-500 text-sm">{a.protocol} · {a.chain}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                a.status === 'active' ? 'bg-green-500/15 text-green-400' :
                a.status === 'upcoming' ? 'bg-purple-500/15 text-purple-400' : 'bg-zinc-500/15 text-zinc-400'
              }`}>{a.status}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-zinc-500">Est. Value</span>
              <span className="text-purple-300 font-semibold">{a.estimated_value}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                <span>Progress</span><span>{a.progress}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${a.progress}%` }} />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {a.tasks.map((t) => (
                <span key={t} className="text-[11px] bg-white/5 px-2 py-0.5 rounded-lg text-zinc-500">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
