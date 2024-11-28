import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon('postgresql://neondb_owner:4OJDYt8WIZVf@ep-weathered-band-a5rxxlr3.us-east-2.aws.neon.tech/neondb?sslmode=require');
export const db = drizzle(sql);
