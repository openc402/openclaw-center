'use client';
import { Alert } from '@/types';

const typeConfig = {
  input_needed: { icon: '🔔', color: 'border-l-yellow-400' },
  error: { icon: '❌', color: 'border-l-red-400' },
  milestone: { icon: '🏆', color: 'border-l-green-400' },
  warning: { icon: '⚠️', color: 'border-l-amber-400' },
};

export default function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="glass overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">⚠️ Alerts & Notifications</h2>
        <p className="text-[11px] text-zinc-600">Things that need your attention</p>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {alerts.map((alert) => {
          const cfg = typeConfig[alert.type];
          return (
            <div key={alert.id} className={`p-3 border-l-2 ${cfg.color} ${alert.resolved ? 'opacity-50' : ''} hover:bg-white/[0.02] transition-colors`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cfg.icon}</span>
                  <span className="text-sm font-medium">{alert.title}</span>
                </div>
                <span className="text-[10px] text-zinc-600">{alert.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 ml-6">{alert.description}</p>
              {alert.resolved && <span className="text-[10px] text-green-500 ml-6">✓ Resolved</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
