import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Try to get DATABASE_URL from environment or fallback to a more robust check
const DATABASE_URL = process.env.DATABASE_URL || process.env.REPLIT_DB_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  console.error("Available environment variables:", Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('DB')));
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });