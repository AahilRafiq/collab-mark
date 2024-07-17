import 'dotenv/config'
import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URI || 'postgres://postgres:icode247@localhost:5432/collabmark',
  }
});
