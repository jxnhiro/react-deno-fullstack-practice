import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.29.2/mod.ts";

import { load } from "https://deno.land/std@0.205.0/dotenv/mod.ts";

const env = await load();

let db: Database;
const MONGODB_URI: string = env["MONGODB_URI"];

export async function connect() {
  const client = new MongoClient();
  await client.connect(MONGODB_URI);

  console.log("Database connection was successful!");
  db = client.database("denoTodo");
}

export function getDb() {
  return db;
}
