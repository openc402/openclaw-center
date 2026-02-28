import AgentPanel from '@/components/AgentPanel';
import { mockAgents } from '@/data/mock';

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🤖 Agents</h1>
        <p className="text-zinc-500 text-sm">All sub-agents, their tasks, logs, and performance</p>
      </div>
      <AgentPanel agents={mockAgents} />
    </div>
  );
}
