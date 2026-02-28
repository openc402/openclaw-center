import GoalTree from '@/components/GoalTree';
import { mockGoals } from '@/data/mock';

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🎯 Goal Tracker</h1>
        <p className="text-zinc-500 text-sm">Objectives, sub-goals, and task breakdown</p>
      </div>
      <GoalTree root={mockGoals} />
    </div>
  );
}
