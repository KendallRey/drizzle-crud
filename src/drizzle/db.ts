import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" });

export const client = postgres(process.env.DATABASE_URL, { max: 1 });
export const db = drizzle(client);
