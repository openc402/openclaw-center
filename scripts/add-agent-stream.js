const { Client } = require('pg');
const c = new Client({ host: 'db.bchqfuidxhypclaminib.supabase.co', port: 5432, database: 'postgres', user: 'postgres', password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false } });
async function run() {
  await c.connect();
  try { await c.query(`alter table public.live_stream add column agent_id text default 'main'`); console.log('✅ agent_id column added'); }
  catch(e) { console.log('⏭️ column exists'); }
  // Also add a stream column to sub_agents for their own thoughts
  try { await c.query(`alter table public.sub_agents add column thoughts jsonb default '[]'`); console.log('✅ thoughts column added'); }
  catch(e) { console.log('⏭️ column exists'); }
  await c.end();
}
run();
