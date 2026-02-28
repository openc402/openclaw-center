import { AgentSession, ActivityEvent, TaskPipeline, GoalNode, SessionStats, Alert, Airdrop, FarmingTask, GasInfo } from '@/types';

// ========== COMMAND CENTER MOCK DATA ==========

export const mockAgents: AgentSession[] = [
  {
    id: 'main',
    label: 'Main Agent',
    status: 'running',
    task: 'Building Command Center dashboard',
    model: 'claude-opus-4',
    startedAt: '2026-02-28T16:59:00Z',
    duration: '1h 05m',
    tokensUsed: 45200,
    cost: '$1.82',
    progress: 60,
    logs: [
      { timestamp: '17:30', type: 'action', message: 'Created GitHub repo openc402/airdrop-farming-saas' },
      { timestamp: '17:32', type: 'action', message: 'Initialized Next.js project' },
      { timestamp: '17:35', type: 'tool', message: 'npm install — installing dependencies' },
      { timestamp: '17:44', type: 'decision', message: 'Switching to Command Center first — better visibility for Nico' },
      { timestamp: '18:02', type: 'action', message: 'Writing Command Center components' },
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
  { id: '1', timestamp: '18:04', type: 'decision', title: 'Priority shift → Command Center first', description: 'Nico needs visibility on agent activity before scaling to airdrop farming' },
  { id: '2', timestamp: '18:02', type: 'file_edit', title: 'Writing dashboard components', description: 'Sidebar, StatCard, ActivityFeed, AgentPanel' },
  { id: '3', timestamp: '17:44', type: 'milestone', title: '✅ GitHub + Supabase accounts created', description: 'openc402 on both platforms, linked via OAuth' },
  { id: '4', timestamp: '17:35', type: 'command', title: 'npm install — Next.js + Tailwind + Supabase', description: 'Setting up project dependencies' },
  { id: '5', timestamp: '17:32', type: 'agent_spawn', title: 'Initialized airdrop-farming-saas repo', description: 'github.com/openc402/airdrop-farming-saas' },
  { id: '6', timestamp: '17:04', type: 'web_browse', title: 'GitHub signup completed', description: 'Created account openc402, email verified' },
  { id: '7', timestamp: '17:02', type: 'web_browse', title: 'Supabase signup via GitHub OAuth', description: 'Organization openc402s Org created (Free plan)' },
];

export const mockTasks: TaskPipeline[] = [
  {
    id: '1',
    title: 'Build Command Center Dashboard',
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
      { id: '1f', title: 'Goal Tracker', status: 'pending' },
      { id: '1g', title: 'Session Stats', status: 'pending' },
      { id: '1h', title: 'Deploy to Vercel', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'Airdrop Farming SaaS',
    status: 'queued',
    priority: 'high',
    createdAt: '2026-02-28T17:14:00Z',
    subtasks: [
      { id: '2a', title: 'Dashboard UI (glassmorphism)', status: 'done' },
      { id: '2b', title: 'Supabase schema', status: 'pending' },
      { id: '2c', title: 'Wallet integration (ethers.js)', status: 'pending' },
      { id: '2d', title: 'Auto-farming scripts', status: 'pending' },
      { id: '2e', title: 'Airdrop scanner', status: 'pending' },
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
      id: 'g1',
      title: 'Command Center (visibility)',
      type: 'subgoal',
      status: 'active',
      progress: 60,
      children: [
        { id: 't1', title: 'Live activity feed', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't2', title: 'Agent monitoring', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't3', title: 'Deploy & connect real data', type: 'task', status: 'active', progress: 0, children: [] },
      ],
    },
    {
      id: 'g2',
      title: 'Airdrop Farming SaaS',
      type: 'subgoal',
      status: 'active',
      progress: 15,
      children: [
        { id: 't4', title: 'Dashboard + tracking', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't5', title: 'On-chain automation', type: 'task', status: 'active', progress: 0, children: [] },
        { id: 't6', title: 'Scanner + alerts', type: 'task', status: 'blocked', progress: 0, children: [] },
      ],
    },
    {
      id: 'g3',
      title: 'Autonomy & Skills',
      type: 'subgoal',
      status: 'active',
      progress: 30,
      children: [
        { id: 't7', title: 'Account creation skill', type: 'task', status: 'completed', progress: 100, children: [] },
        { id: 't8', title: 'Crypto wallet management', type: 'task', status: 'active', progress: 20, children: [] },
      ],
    },
  ],
};

export const mockStats: SessionStats = {
  totalTokens: 45200,
  totalCost: '$1.82',
  sessionDuration: '1h 05m',
  actionsCount: 34,
  agentsSpawned: 1,
  filesEdited: 18,
  commandsRun: 12,
};

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'GitHub & Supabase accounts created',
    description: 'Both accounts operational — openc402',
    timestamp: '17:07',
    resolved: true,
  },
  {
    id: '2',
    type: 'input_needed',
    title: 'Verification code needed',
    description: 'GitHub sent a code to openc402@gmail.com — should have checked mail myself',
    timestamp: '17:04',
    resolved: true,
  },
  {
    id: '3',
    type: 'warning',
    title: 'npm install timeout',
    description: 'Package installation took too long and was killed. Retrying...',
    timestamp: '17:35',
    resolved: true,
  },
];

// ========== AIRDROP MOCK DATA ==========

export const mockAirdrops: Airdrop[] = [
  {
    id: '1', name: 'LayerZero', protocol: 'LayerZero', chain: 'Multi-chain',
    status: 'active', estimated_value: '$1,500 - $5,000', deadline: '2026-06-01',
    snapshot_date: null, tge_date: null, tasks: ['Bridge', 'Swap', 'Provide LP'], progress: 65, url: '#',
  },
  {
    id: '2', name: 'zkSync Era', protocol: 'zkSync', chain: 'zkSync',
    status: 'active', estimated_value: '$2,000 - $8,000', deadline: null,
    snapshot_date: null, tge_date: null, tasks: ['Bridge ETH', 'Use DEX', 'Mint NFT'], progress: 42, url: '#',
  },
  {
    id: '3', name: 'Scroll', protocol: 'Scroll', chain: 'Scroll',
    status: 'upcoming', estimated_value: '$500 - $3,000', deadline: '2026-04-15',
    snapshot_date: '2026-03-30', tge_date: null, tasks: ['Bridge', 'Swap'], progress: 20, url: '#',
  },
];

export const mockFarmingTasks: FarmingTask[] = [
  { id: '1', airdrop_name: 'LayerZero', task_type: 'bridge', description: 'Bridge ETH via Stargate', status: 'completed', last_run: '2026-02-28T14:30:00Z', next_run: '2026-03-01T14:30:00Z', frequency: 'Daily' },
  { id: '2', airdrop_name: 'zkSync', task_type: 'swap', description: 'Swap ETH/USDC on SyncSwap', status: 'running', last_run: '2026-02-28T15:00:00Z', next_run: null, frequency: 'Every 6h' },
  { id: '3', airdrop_name: 'Scroll', task_type: 'interact', description: 'Interact with Ambient Finance', status: 'pending', last_run: null, next_run: '2026-03-01T10:00:00Z', frequency: 'Daily' },
];

export const mockGas: GasInfo[] = [
  { chain: 'Ethereum', gas_price_gwei: 12, status: 'low' },
  { chain: 'Arbitrum', gas_price_gwei: 0.1, status: 'low' },
  { chain: 'Base', gas_price_gwei: 0.05, status: 'low' },
  { chain: 'zkSync', gas_price_gwei: 0.25, status: 'medium' },
];
