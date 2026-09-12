import { Pool } from "pg";

let pool: Pool | null = null;

export function getDesktopLeadsPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DESKTOP_LEADS_DATABASE_URL;
    if (!connectionString) {
      throw new Error("DESKTOP_LEADS_DATABASE_URL is not set");
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}
