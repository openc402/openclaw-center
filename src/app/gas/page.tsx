import { mockGas } from '@/data/mock';

const statusColor = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };

export default function GasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⛽ Gas Tracker</h1>
        <p className="text-zinc-500 text-sm">Real-time gas prices across chains</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockGas.map((g) => (
          <div key={g.chain} className="glass p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{g.chain}</h3>
              <p className="text-xs text-zinc-500">Gas price</p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-mono font-bold ${statusColor[g.status]}`}>{g.gas_price_gwei}</p>
              <p className="text-[11px] text-zinc-600">gwei</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
