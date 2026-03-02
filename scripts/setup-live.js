const { Client } = require('pg');
const client = new Client({
  host: 'db.bchqfuidxhypclaminib.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected!');

  // Live stream - my real-time thoughts as I work
  await client.query(`
    create table if not exists public.live_stream (
      id bigserial primary key,
      task_id uuid default gen_random_uuid(),
      type text default 'thought',
      content text not null,
      metadata jsonb default '{}',
      created_at timestamptz default now()
    )
  `);
  console.log('✅ live_stream table');

  // Task sessions - groups of live_stream entries
  await client.query(`
    create table if not exists public.task_sessions (
      id uuid default gen_random_uuid() primary key,
      title text not null,
      summary text,
      status text default 'running',
      category text,
      started_at timestamptz default now(),
      ended_at timestamptz,
      metadata jsonb default '{}'
    )
  `);
  console.log('✅ task_sessions table');

  // Enable RLS
  for (const t of ['live_stream', 'task_sessions']) {
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

  // Enable Supabase Realtime on live_stream
  await client.query(`alter publication supabase_realtime add table public.live_stream`);
  console.log('✅ Realtime enabled on live_stream');

  try {
    await client.query(`alter publication supabase_realtime add table public.task_sessions`);
    console.log('✅ Realtime enabled on task_sessions');
  } catch(e) { console.log('⏭️ task_sessions already in publication'); }

  // Also enable realtime on agent_status
  try {
    await client.query(`alter publication supabase_realtime add table public.agent_status`);
    console.log('✅ Realtime enabled on agent_status');
  } catch(e) { console.log('⏭️ agent_status already in publication'); }

  await client.end();
  console.log('\n🎉 Live stream setup complete!');
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
