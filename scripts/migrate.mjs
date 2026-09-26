// Applies every new .sql file in supabase/migrations to the database, in order.
// Usage: npm run db:migrate   (needs DATABASE_URL in .env.local)

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "Set DATABASE_URL in .env.local. Supabase dashboard -> Connect -> Session pooler -> copy the URI.",
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

await client.query(`
  create table if not exists public._migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  );
  alter table public._migrations enable row level security;
`);

const dir = path.resolve("supabase/migrations");
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
const { rows } = await client.query("select name from public._migrations");
const done = new Set(rows.map((r) => r.name));

for (const file of files) {
  if (done.has(file)) {
    console.log("already applied:", file);
    continue;
  }
  const sql = await readFile(path.join(dir, file), "utf8");
  console.log("applying:", file);
  await client.query("begin");
  try {
    await client.query(sql);
    await client.query("insert into public._migrations (name) values ($1)", [file]);
    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    console.error("failed:", file);
    console.error(err.message);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log("database is up to date");
