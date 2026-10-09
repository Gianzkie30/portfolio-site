import { neon } from "@neondatabase/serverless";

export type User = {
  id: number; name: string; email: string; phone: string;
  headline: string; bio: string; role: "user" | "admin"; created_at: string;
};
export type Skill = { id: number; user_id: number; name: string; level: string };
export type Booking = {
  id: number; user_id: number; service: string; title: string; details: string;
  budget: string; preferred_date: string; status: string; admin_note: string;
  created_at: string; updated_at: string;
};
export type BookingWithClient = Booking & { client_name: string; client_email: string; client_phone: string };

let sql: ReturnType<typeof neon> | null = null;
let ready: Promise<void> | null = null;

async function init(q: ReturnType<typeof neon>) {
  await q`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    headline TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'Intermediate'
  )`;
  await q`CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    budget TEXT NOT NULL DEFAULT '',
    preferred_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
}

/** Returns a SQL tagged-template client; tables are created automatically on first use. */
export async function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!sql) sql = neon(process.env.DATABASE_URL);
  if (!ready) ready = init(sql).catch((e) => { ready = null; throw e; });
  await ready;
  return sql as (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, any>[]>;
}

