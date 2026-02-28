'use client';
import { GoalNode } from '@/types';

const statusIcon = {
  active: '🔵',
  completed: '✅',
  blocked: '🚫',
};

function GoalNodeView({ node, depth = 0 }: { node: GoalNode; depth?: number }) {
  return (
    <div className={`${depth > 0 ? 'ml-6 border-l border-white/5 pl-4' : ''}`}>
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm">{statusIcon[node.status]}</span>
        <span className={`text-sm ${node.type === 'goal' ? 'font-bold' : node.type === 'subgoal' ? 'font-semibold' : ''} ${
          node.status === 'completed' ? 'text-zinc-500 line-through' : ''
        }`}>
          {node.title}
        </span>
        {node.progress > 0 && node.progress < 100 && (
          <span className="text-[10px] text-purple-400">{node.progress}%</span>
        )}
      </div>
      {node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <GoalNodeView key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GoalTree({ root }: { root: GoalNode }) {
  return (
    <div className="glass overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">🎯 Goal Tracker</h2>
        <p className="text-[11px] text-zinc-600">Objective → Sub-goals → Tasks</p>
      </div>
      <div className="p-4">
        <GoalNodeView node={root} />
      </div>
    </div>
  );
}
