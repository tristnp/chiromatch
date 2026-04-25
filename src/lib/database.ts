import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

export function hasDatabaseConfig() {
  return Boolean(getDatabaseUrl());
}

function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}

async function ensureSchema() {
  const client = await getPool().connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        accident_date TEXT NOT NULL,
        injury_concern TEXT NOT NULL,
        preferred_contact_time TEXT NOT NULL,
        page_source TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_applications (
        id UUID PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        contact_name TEXT NOT NULL,
        practice_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        license_number TEXT NOT NULL,
        malpractice_status TEXT NOT NULL,
        specialties TEXT NOT NULL,
        desired_lead_volume TEXT NOT NULL,
        notes TEXT,
        page_source TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

export async function ensureDatabaseSchema() {
  if (!schemaReady) {
    schemaReady = ensureSchema();
  }

  return schemaReady;
}

export async function queryDatabase<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  await ensureDatabaseSchema();
  return getPool().query<T>(text, values);
}
