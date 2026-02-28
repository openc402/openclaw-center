'use client';
import { ActivityEvent } from '@/types';

const typeConfig: Record<ActivityEvent['type'], { icon: string; color: string }> = {
  file_edit: { icon: '📝', color: 'text-blue-400' },
  command: { icon: '⌨️', color: 'text-yellow-400' },
  web_browse: { icon: '🌐', color: 'text-cyan-400' },
  agent_spawn: { icon: '🤖', color: 'text-purple-400' },
  message: { icon: '💬', color: 'text-zinc-400' },
  decision: { icon: '🧠', color: 'text-amber-400' },
  error: { icon: '❌', color: 'text-red-400' },
  milestone: { icon: '✅', color: 'text-green-400' },
};

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="glass overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">🔴 Live Activity</h2>
          <p className="text-[11px] text-zinc-600">Real-time feed of all actions</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
          <span className="text-[11px] text-red-400">LIVE</span>
        </div>
      </div>
      <div className="max-h-[450px] overflow-y-auto">
        {events.map((event) => {
          const config = typeConfig[event.type];
          return (
            <div key={event.id} className="feed-item px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <div className="flex gap-3">
                <span className="text-base mt-0.5">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium ${config.color}`}>{event.title}</p>
                    <span className="text-[10px] text-zinc-600 whitespace-nowrap ml-2">{event.timestamp}</span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
