import StatsBar from '@/components/StatsBar';
import ActivityFeed from '@/components/ActivityFeed';
import AgentPanel from '@/components/AgentPanel';
import TaskPipelineView from '@/components/TaskPipeline';
import AlertsPanel from '@/components/AlertsPanel';
import GoalTree from '@/components/GoalTree';
import { mockAgents, mockActivity, mockTasks, mockGoals, mockStats, mockAlerts } from '@/data/mock';

export default function CommandCenter() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🎛️ Command Center</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Real-time overview of all operations</p>
        </div>
        <div className="flex items-center gap-2 glass-sm px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
          <span className="text-sm text-green-400">System Online</span>
        </div>
      </div>
      <StatsBar stats={mockStats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed events={mockActivity} />
          <TaskPipelineView tasks={mockTasks} />
        </div>
        <div className="space-y-6">
          <AgentPanel agents={mockAgents} />
          <AlertsPanel alerts={mockAlerts} />
        </div>
      </div>
      <GoalTree root={mockGoals} />
    </div>
  );
}
