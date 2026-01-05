import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// We'll use this if a database is provisioned, but for now we might be using MemStorage
// as per the user's "no backend logic" preference (keeping it simple).
// However, the Lite Build template requires this file.

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Database functionality will not work.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/db" });
export const db = drizzle(pool, { schema });
