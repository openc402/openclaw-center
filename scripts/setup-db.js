const { Client } = require('pg');

const client = new Client({
  host: 'db.bchqfuidxhypclaminib.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Pup83965.Supa!',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected!');

  // Agent status - my live state
  await client.query(`
    create table if not exists public.agent_status (
      id text primary key default 'main',
      name text default 'Main Agent',
      model text,
      status text default 'online',
      last_active timestamptz default now(),
      uptime_start timestamptz default now(),
      current_task text,
      session_count int default 0,
      total_messages int default 0,
      metadata jsonb default '{}'
    )
  `);
  console.log('✅ agent_status');

  // Activity log - my action feed
  await client.query(`
    create table if not exists public.activity_log (
      id uuid default gen_random_uuid() primary key,
      agent_id text default 'main',
      action text not null,
      category text,
      details text,
      metadata jsonb default '{}',
      created_at timestamptz default now()
    )
  `);
  console.log('✅ activity_log');

  // Goals - goal tree
  await client.query(`
    create table if not exists public.goals (
      id uuid default gen_random_uuid() primary key,
      parent_id uuid references public.goals(id),
      title text not null,
      description text,
      status text default 'active',
      progress int default 0,
      priority text default 'medium',
      due_date timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `);
  console.log('✅ goals');

  // Sub-agents
  await client.query(`
    create table if not exists public.sub_agents (
      id text primary key,
      label text,
      task text,
      status text default 'running',
      model text,
      runtime text,
      started_at timestamptz default now(),
      completed_at timestamptz,
      result text,
      metadata jsonb default '{}'
    )
  `);
  console.log('✅ sub_agents');

  // Agent settings
  await client.query(`
    create table if not exists public.agent_settings (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz default now()
    )
  `);
  console.log('✅ agent_settings');

  // RLS
  for (const t of ['agent_status', 'activity_log', 'goals', 'sub_agents', 'agent_settings']) {
    await client.query(`alter table public.${t} enable row level security`);
    for (const op of ['select', 'insert', 'update', 'delete']) {
      try {
        if (op === 'insert') {
          await client.query(`create policy "auth_${t}_${op}" on public.${t} for ${op} to authenticated with check (true)`);
        } else {
          await client.query(`create policy "auth_${t}_${op}" on public.${t} for ${op} to authenticated using (true)`);
        }
      } catch(e) { /* exists */ }
    }
  }
  console.log('✅ RLS policies');

  // Seed agent status
  await client.query(`
    insert into public.agent_status (id, name, model, status, current_task, session_count, total_messages)
    values ('main', 'OpenClaw Agent', 'claude-opus-4-6', 'online', 'Command Center deployment', 1, 0)
    on conflict (id) do update set status = 'online', last_active = now()
  `);
  console.log('✅ Agent status seeded');

  // Seed goals
  const goalCount = await client.query(`select count(*) from public.goals`);
  if (goalCount.rows[0].count === '0') {
    // Top-level goals
    const g1 = await client.query(`insert into public.goals (title, description, status, progress, priority) values ('Airdrop Farming SaaS', 'Build and deploy the airdrop farming dashboard with real backend', 'active', 80, 'high') returning id`);
    const g2 = await client.query(`insert into public.goals (title, description, status, progress, priority) values ('OpenClaw Command Center', 'Build real-time agent visibility dashboard', 'active', 40, 'high') returning id`);
    const g3 = await client.query(`insert into public.goals (title, description, status, progress, priority) values ('Auto-Farming Scripts', 'Develop automated on-chain farming for tracked airdrops', 'active', 5, 'medium') returning id`);

    // Sub-goals for Airdrop SaaS
    await client.query(`insert into public.goals (parent_id, title, status, progress) values 
      ('${g1.rows[0].id}', 'Frontend pages (Dashboard, Airdrops, Wallet, Gas, Calendar, Settings)', 'completed', 100),
      ('${g1.rows[0].id}', 'Supabase Auth (login, signup disabled)', 'completed', 100),
      ('${g1.rows[0].id}', 'Real backend (on-chain balances, gas prices, ETH price)', 'completed', 100),
      ('${g1.rows[0].id}', 'GitHub Pages deployment', 'completed', 100),
      ('${g1.rows[0].id}', 'Mobile responsive', 'completed', 100),
      ('${g1.rows[0].id}', 'Wallet integration (ethers.js)', 'active', 30)
    `);

    // Sub-goals for Command Center
    await client.query(`insert into public.goals (parent_id, title, status, progress) values 
      ('${g2.rows[0].id}', 'Frontend scaffold', 'completed', 100),
      ('${g2.rows[0].id}', 'Auth + GitHub Pages deploy', 'completed', 100),
      ('${g2.rows[0].id}', 'Real agent data integration', 'active', 50),
      ('${g2.rows[0].id}', 'Live activity feed', 'active', 0),
      ('${g2.rows[0].id}', 'Sub-agent monitoring', 'active', 0)
    `);

    console.log('✅ Goals seeded');
  }

  // Seed activity log
  const logCount = await client.query(`select count(*) from public.activity_log`);
  if (logCount.rows[0].count === '0') {
    await client.query(`
      insert into public.activity_log (action, category, details, created_at) values
      ('Created GitHub account openc402', 'setup', 'GitHub account for project hosting', now() - interval '3 hours'),
      ('Created Supabase project airdrop-farming', 'setup', 'EU West region, PostgreSQL backend', now() - interval '2.5 hours'),
      ('Built Airdrop Farming SaaS frontend', 'build', '10 pages: Dashboard, Airdrops, Farming, Wallet, Calendar, Gas, Leaderboard, Settings', now() - interval '2 hours'),
      ('Built OpenClaw Command Center frontend', 'build', '5 pages: Command Center, Agents, Goals, Replay, Settings', now() - interval '1.5 hours'),
      ('Deployed Airdrop SaaS to GitHub Pages', 'deploy', 'https://openc402.github.io/airdrop-farming-saas/', now() - interval '1 hour'),
      ('Connected real backend to Airdrop SaaS', 'build', 'Supabase DB, on-chain balances via RPCs, live gas prices, ETH price from CoinGecko', now() - interval '45 minutes'),
      ('Created Supabase tables', 'database', 'wallets, airdrops, farming_tasks + RLS policies', now() - interval '40 minutes'),
      ('Added mobile responsive design', 'build', 'Hamburger menu, responsive grids, mobile-first layout', now() - interval '30 minutes'),
      ('Deployed OpenClaw Center to GitHub Pages', 'deploy', 'https://openc402.github.io/openclaw-center/', now() - interval '10 minutes'),
      ('Building Command Center real backend', 'build', 'Agent status, activity feed, goals, sub-agents from Supabase', now())
    `);
    console.log('✅ Activity log seeded');
  }

  // Seed default settings
  await client.query(`
    insert into public.agent_settings (key, value) values
    ('notifications', '{"discord": true, "email": false, "frequency": "important"}'),
    ('agent_model', '"claude-opus-4-6"'),
    ('heartbeat_interval', '30'),
    ('auto_commit', 'true'),
    ('timezone', '"Europe/Paris"')
    on conflict (key) do nothing
  `);
  console.log('✅ Settings seeded');

  await client.end();
  console.log('\n🎉 Command Center DB setup complete!');
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
