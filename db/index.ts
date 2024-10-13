import { drizzle } from 'drizzle-orm/libsql';
import {createClient} from "@libsql/client";

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!
});
const db = drizzle(client);

export default db;