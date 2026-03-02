const { Client } = require('pg');
const c = new Client({ host: 'db.bchqfuidxhypclaminib.supabase.co', port: 5432, database: 'postgres', user: 'postgres', password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false } });
async function run() {
  await c.connect();
  for (const t of ['sub_agents', 'goals', 'agent_settings']) {
    try { await c.query(`alter publication supabase_realtime add table public.${t}`); console.log(`✅ ${t}`); }
    catch(e) { console.log(`⏭️ ${t} already`); }
  }
  await c.end();
}
run();
