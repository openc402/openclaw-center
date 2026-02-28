'use client';
import { TaskPipeline as TaskPipelineType } from '@/types';

const statusConfig = {
  queued: { icon: '⏳', color: 'text-zinc-500' },
  in_progress: { icon: '🔄', color: 'text-purple-400' },
  completed: { icon: '✅', color: 'text-green-400' },
  blocked: { icon: '🚫', color: 'text-red-400' },
  failed: { icon: '❌', color: 'text-red-400' },
};

const priorityBadge = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-yellow-500/15 text-yellow-400',
  low: 'bg-zinc-500/15 text-zinc-400',
};

export default function TaskPipelineView({ tasks }: { tasks: TaskPipelineType[] }) {
  return (
    <div className="glass overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">📋 Task Pipeline</h2>
        <p className="text-[11px] text-zinc-600">All tasks — queued, in progress, done</p>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {tasks.map((task) => {
          const cfg = statusConfig[task.status];
          const done = task.subtasks.filter((s) => s.status === 'done').length;
          const total = task.subtasks.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div key={task.id} className="p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span>{cfg.icon}</span>
                  <span className={`font-medium text-sm ${cfg.color}`}>{task.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityBadge[task.priority]}`}>
                  {task.priority}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] text-zinc-500">{done}/{total}</span>
              </div>

              {/* Subtasks */}
              <div className="space-y-1">
                {task.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 text-[11px]">
                    <span>{sub.status === 'done' ? '✅' : sub.status === 'failed' ? '❌' : '⬜'}</span>
                    <span className={sub.status === 'done' ? 'text-zinc-500 line-through' : 'text-zinc-400'}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
