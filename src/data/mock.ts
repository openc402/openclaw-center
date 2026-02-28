import { AgentSession, ActivityEvent, TaskPipeline, GoalNode, SessionStats, Alert } from '@/types';

export const mockAgents: AgentSession[] = [
  {
    id: 'main',
    label: 'Main Agent',
    status: 'running',
    task: 'Building Command Center + Airdrop SaaS',
    model: 'claude-opus-4',
    startedAt: '2026-02-28T16:59:00Z',
    duration: '1h 20m',
    tokensUsed: 52000,
    cost: '$2.10',
    progress: 65,
    logs: [
      { timestamp: '17:30', type: 'action', message: 'Created GitHub repo openc402/airdrop-farming-saas' },
      { timestamp: '17:32', type: 'action', message: 'Initialized Next.js project' },
      { timestamp: '17:44', type: 'decision', message: 'Priority shift → Command Center first for visibility' },
      { timestamp: '18:04', type: 'action', message: 'Writing Command Center components' },
      { timestamp: '18:18', type: 'decision', message: 'Split into 2 separate projects per Nico request' },
    ],
  },
  {
    id: 'sub-1',
    label: 'Airdrop Scanner',
    status: 'idle',
    task: 'Scan Twitter & blogs for new airdrop opportunities',
    model: 'claude-sonnet-4',
    startedAt: '2026-02-28T17:00:00Z',
    tokensUsed: 0,
    cost: '$0.00',
    logs: [],
  },
];

export const mockActivity: ActivityEvent[] = [
  { id: '1', timestamp: '18:18', type: 'decision', title: 'Split into 2 projects', description: 'Command Center and Airdrop SaaS now separate per Nico request' },
  { id: '2', timestamp: '18:04', type: 'decision', title: 'Priority shift → Command Center first', description: 'Nico needs visibility on agent activity before scaling' },
  { id: '3', timestamp: '18:02', type: 'file_edit', title: 'Writing dashboard components', description: 'Sidebar, StatCard, ActivityFeed, AgentPanel, GoalTree' },
  { id: '4', timestamp: '17:44', type: 'milestone', title: '✅ GitHub + Supabase accounts created', description: 'openc402 on both platforms' },
  { id: '5', timestamp: '17:35', type: 'command', title: 'npm install — Next.js + Tailwind + Supabase' },
  { id: '6', timestamp: '17:32', type: 'agent_spawn', title: 'Initialized airdrop-farming-saas repo', description: 'github.com/openc402/airdrop-farming-saas' },
  { id: '7', timestamp: '17:04', type: 'web_browse', title: 'GitHub signup completed', description: 'Account openc402 created and verified' },
  { id: '8', timestamp: '17:02', type: 'web_browse', title: 'Supabase signup via GitHub OAuth', description: 'Org openc402s Org created (Free)' },
];

export const mockTasks: TaskPipeline[] = [
  {
    id: '1',
    title: 'Build Command Center',
    status: 'in_progress',
    priority: 'high',
    agentId: 'main',
    createdAt: '2026-02-28T18:02:00Z',
    subtasks: [
      { id: '1a', title: 'Project setup (Next.js + Tailwind)', status: 'done' },
      { id: '1b', title: 'Sidebar + Layout', status: 'done' },
      { id: '1c', title: 'Live Activity Feed', status: 'done' },
      { id: '1d', title: 'Agent Panel', status: 'done' },
      { id: '1e', title: 'Task Pipeline view', status: 'done' },
      { id: '1f', title: 'Goal Tracker', status: 'done' },
      { id: '1g', title: 'Push to GitHub', status: 'pending' },
      { id: '1h', title: 'Deploy', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'Build Airdrop Farming SaaS',
    status: 'queued',
    priority: 'high',
    createdAt: '2026-02-28T17:14:00Z',
    subtasks: [
      { id: '2a', title: 'Separate project setup', status: 'pending' },
      { id: '2b', title: 'Dashboard UI (glassmorphism)', status: 'pending' },
      { id: '2c', title: 'Supabase schema', status: 'pending' },
      { id: '2d', title: 'Wallet integration (ethers.js)', status: 'pending' },
      { id: '2e', title: 'Auto-farming scripts', status: 'pending' },
      { id: '2f', title: 'Airdrop scanner', status: 'pending' },
    ],
  },
  {
    id: '3',
    title: 'Create accounts autonomously',
    status: 'completed',
    priority: 'medium',
    agentId: 'main',
    createdAt: '2026-02-28T17:00:00Z',
    completedAt: '2026-02-28T17:07:00Z',
    subtasks: [
      { id: '3a', title: 'GitHub account (openc402)', status: 'done' },
      { id: '3b', title: 'Supabase account (via GitHub)', status: 'done' },
    ],
  },
];

export const mockGoals: GoalNode = {
  id: 'root',
  title: 'Autonomous Airdrop Farming System',
  type: 'goal',
  status: 'active',
  progress: 25,
  children: [
    {
      id: 'g1', title: 'Command Center (visibility)', type: 'subgoal', status: 'active', progress: 70,
      children: [
        { id: 't1', title: 'Live activity feed', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't2', title: 'Agent monitoring', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't3', title: 'Deploy & connect real data', type: 'task', status: 'active', progress: 0, children: [] },
      ],
    },
    {
      id: 'g2', title: 'Airdrop Farming SaaS', type: 'subgoal', status: 'active', progress: 5,
      children: [
        { id: 't4', title: 'Separate project + UI', type: 'task', status: 'active', progress: 0, children: [] },
        { id: 't5', title: 'On-chain automation', type: 'task', status: 'blocked', progress: 0, children: [] },
        { id: 't6', title: 'Scanner + alerts', type: 'task', status: 'blocked', progress: 0, children: [] },
      ],
    },
    {
      id: 'g3', title: 'Autonomy & Skills', type: 'subgoal', status: 'active', progress: 30,
      children: [
        { id: 't7', title: 'Account creation skill', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't8', title: 'Crypto wallet management', type: 'task', status: 'active', progress: 20, children: [] },
      ],
    },
  ],
};

export const mockStats: SessionStats = {
  totalTokens: 52000,
  totalCost: '$2.10',
  sessionDuration: '1h 20m',
  actionsCount: 38,
  agentsSpawned: 1,
  filesEdited: 22,
  commandsRun: 15,
};

export const mockAlerts: Alert[] = [
  { id: '1', type: 'milestone', title: 'GitHub & Supabase accounts created', description: 'openc402 operational', timestamp: '17:07', resolved: true },
  { id: '2', type: 'input_needed', title: 'Verification code needed', description: 'Next time: check mail myself', timestamp: '17:04', resolved: true },
  { id: '3', type: 'warning', title: 'npm install timeout', description: 'Retried successfully', timestamp: '17:35', resolved: true },
];
