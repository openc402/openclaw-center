const { Client } = require('pg');
const client = new Client({
  host: 'db.bchqfuidxhypclaminib.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  // Mark Airdrop SaaS wallet integration as completed
  await client.query(`update public.goals set status = 'completed', progress = 100 where title = 'Wallet integration (ethers.js)'`);

  // Update Airdrop SaaS parent to 100%
  await client.query(`update public.goals set progress = 100, status = 'completed' where title = 'Airdrop Farming SaaS'`);

  // Mark Command Center sub-tasks as completed
  await client.query(`update public.goals set status = 'completed', progress = 100 where title in ('Real agent data integration', 'Live activity feed', 'Sub-agent monitoring')`);

  // Update Command Center parent to 100%
  await client.query(`update public.goals set progress = 100, status = 'completed' where title = 'OpenClaw Command Center'`);

  // Update Auto-Farming Scripts progress
  await client.query(`update public.goals set progress = 10 where title = 'Auto-Farming Scripts'`);

  await client.end();
  console.log('✅ Goals updated!');
}
run().catch(e => { console.error(e.message); process.exit(1); });
