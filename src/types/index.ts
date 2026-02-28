// ========== COMMAND CENTER TYPES ==========

export interface AgentSession {
  id: string;
  label: string;
  status: 'running' | 'completed' | 'failed' | 'idle';
  task: string;
  model: string;
  startedAt: string;
  duration?: string;
  tokensUsed?: number;
  cost?: string;
  progress?: number;
  logs: LogEntry[];
}

export interface LogEntry {
  timestamp: string;
  type: 'action' | 'decision' | 'error' | 'info' | 'tool';
  message: string;
  details?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'file_edit' | 'command' | 'web_browse' | 'agent_spawn' | 'message' | 'decision' | 'error' | 'milestone';
  title: string;
  description?: string;
  agentId?: string;
  metadata?: Record<string, string>;
}

export interface TaskPipeline {
  id: string;
  title: string;
  status: 'queued' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  priority: 'high' | 'medium' | 'low';
  agentId?: string;
  subtasks: SubTask[];
  createdAt: string;
  completedAt?: string;
}

export interface SubTask {
  id: string;
  title: string;
  status: 'pending' | 'done' | 'failed';
}

export interface GoalNode {
  id: string;
  title: string;
  type: 'goal' | 'subgoal' | 'task';
  status: 'active' | 'completed' | 'blocked';
  children: GoalNode[];
  progress: number;
}

export interface SessionStats {
  totalTokens: number;
  totalCost: string;
  sessionDuration: string;
  actionsCount: number;
  agentsSpawned: number;
  filesEdited: number;
  commandsRun: number;
}

export interface Alert {
  id: string;
  type: 'input_needed' | 'error' | 'milestone' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  actionUrl?: string;
}

// ========== AIRDROP TYPES ==========

export interface Airdrop {
  id: string;
  name: string;
  protocol: string;
  chain: string;
  status: 'active' | 'upcoming' | 'ended';
  estimated_value: string;
  deadline: string | null;
  snapshot_date: string | null;
  tge_date: string | null;
  tasks: string[];
  progress: number;
  url: string;
}

export interface FarmingTask {
  id: string;
  airdrop_name: string;
  task_type: 'bridge' | 'swap' | 'liquidity' | 'interact' | 'stake' | 'other';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  last_run: string | null;
  next_run: string | null;
  frequency: string;
}

export interface GasInfo {
  chain: string;
  gas_price_gwei: number;
  status: 'low' | 'medium' | 'high';
}
