import { defineConfig, Config } from 'drizzle-kit';

const config: Config = {
  schema: "./src/drizzle/schema.ts",
  out: './src/drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: 'postgresql',
  verbose: true,
  strict: true,
}

export default defineConfig(config)