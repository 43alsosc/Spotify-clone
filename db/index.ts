import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { account, session, user, verification } from "./auth-schema";

config({ path: ".env.local" });

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    user,
    session,
    account,
    verification,
  },
});
