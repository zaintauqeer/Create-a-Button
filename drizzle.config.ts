import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:4OJDYt8WIZVf@ep-weathered-band-a5rxxlr3.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
  verbose: true,
  strict: true,
});
