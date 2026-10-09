"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { createSession, destroySession, requireAdmin, requireUser } from "./auth";
import { SERVICES, SKILL_LEVELS, STATUSES } from "./constants";

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
const enc = encodeURIComponent;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Auth ---------- */
export async function register(fd: FormData) {
  const name = str(fd, "name", 100);
  const email = str(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!name || !EMAIL_RE.test(email)) redirect(`/register?error=${enc("Enter a valid name and email.")}`);
  if (password.length < 8) redirect(`/register?error=${enc("Password must be at least 8 characters.")}`);

  const sql = await db();
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length) redirect(`/register?error=${enc("That email is already registered.")}`);

  const hash = await bcrypt.hash(password, 10);
  const role = process.env.ADMIN_EMAIL?.toLowerCase() === email ? "admin" : "user";
  const rows = await sql`INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${hash}, ${role}) RETURNING id`;
  await createSession(rows[0].id);
  redirect(role === "admin" ? "/admin" : "/dashboard");
}

export async function login(fd: FormData) {
  const email = str(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  const sql = await db();
  const rows = await sql`SELECT id, password_hash, role FROM users WHERE email = ${email}`;
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash))) {
    redirect(`/login?error=${enc("Invalid email or password.")}`);
  }
  let role = u.role;
  if (process.env.ADMIN_EMAIL?.toLowerCase() === email && role !== "admin") {
    await sql`UPDATE users SET role = 'admin' WHERE id = ${u.id}`;
    role = "admin";
  }
  await createSession(u.id);
  redirect(role === "admin" ? "/admin" : "/dashboard");
}

export async function logout() {
  destroySession();
  redirect("/");
}

/* ---------- Profile ---------- */
export async function updateProfile(fd: FormData) {
  const user = await requireUser();
  const name = str(fd, "name", 100);
  const email = str(fd, "email", 200).toLowerCase();
  if (!name || !EMAIL_RE.test(email)) redirect(`/dashboard/profile?error=${enc("Enter a valid name and email.")}`);
  const sql = await db();
  const clash = await sql`SELECT id FROM users WHERE email = ${email} AND id <> ${user.id}`;
  if (clash.length) redirect(`/dashboard/profile?error=${enc("That email is used by another account.")}`);
  await sql`UPDATE users SET name = ${name}, email = ${email}, phone = ${str(fd, "phone", 40)},
    headline = ${str(fd, "headline", 140)}, bio = ${str(fd, "bio", 2000)} WHERE id = ${user.id}`;
  revalidatePath("/", "layout");
  redirect("/dashboard/profile?saved=1");
}

/* ---------- Skills ---------- */
const level = (fd: FormData) => {
  const l = str(fd, "level", 30);
  return (SKILL_LEVELS as readonly string[]).includes(l) ? l : "Intermediate";
};

export async function addSkill(fd: FormData) {
  const user = await requireUser();
  const name = str(fd, "name", 60);
  if (!name) redirect(`/dashboard/skills?error=${enc("Skill name is required.")}`);
  const sql = await db();
  await sql`INSERT INTO skills (user_id, name, level) VALUES (${user.id}, ${name}, ${level(fd)})`;
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/skills?saved=1");
}

export async function updateSkill(fd: FormData) {
  const user = await requireUser();
  const id = Number(fd.get("id"));
  const name = str(fd, "name", 60);
  if (!name) redirect(`/dashboard/skills?error=${enc("Skill name is required.")}`);
  const sql = await db();
  await sql`UPDATE skills SET name = ${name}, level = ${level(fd)} WHERE id = ${id} AND user_id = ${user.id}`;
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/skills?saved=1");
}

export async function deleteSkill(fd: FormData) {
  const user = await requireUser();
  const sql = await db();
  await sql`DELETE FROM skills WHERE id = ${Number(fd.get("id"))} AND user_id = ${user.id}`;
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/skills");
}

/* ---------- Bookings ---------- */
export async function createBooking(fd: FormData) {
  const user = await requireUser();
  const service = str(fd, "service", 60);
  const title = str(fd, "title", 140);
  const details = str(fd, "details", 4000);
  const budget = str(fd, "budget", 60);
  const date = str(fd, "preferred_date", 10);
  if (!SERVICES.some((s) => s.name === service)) redirect(`/dashboard/book?error=${enc("Choose a service.")}`);
  if (!title || !details) redirect(`/dashboard/book?error=${enc("Project title and details are required.")}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) redirect(`/dashboard/book?error=${enc("Pick a preferred completion date.")}`);
  const sql = await db();
  await sql`INSERT INTO bookings (user_id, service, title, details, budget, preferred_date)
    VALUES (${user.id}, ${service}, ${title}, ${details}, ${budget}, ${date})`;
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/bookings?created=1");
}

/* ---------- Admin ---------- */
export async function adminUpdateBooking(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = str(fd, "status", 30);
  if (!(STATUSES as readonly string[]).includes(status)) redirect(`/admin/bookings/${id}?error=${enc("Invalid status.")}`);
  const sql = await db();
  await sql`UPDATE bookings SET status = ${status}, admin_note = ${str(fd, "admin_note", 2000)}, updated_at = now() WHERE id = ${id}`;
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
  redirect(`/admin/bookings/${id}?saved=1`);
}

export async function adminUpdateUser(fd: FormData) {
  const admin = await requireAdmin();
  const id = Number(fd.get("id"));
  const name = str(fd, "name", 100);
  const email = str(fd, "email", 200).toLowerCase();
  const back = `/admin/users/${id}`;
  if (!name || !EMAIL_RE.test(email)) redirect(`${back}?error=${enc("Enter a valid name and email.")}`);
  const sql = await db();
  const clash = await sql`SELECT id FROM users WHERE email = ${email} AND id <> ${id}`;
  if (clash.length) redirect(`${back}?error=${enc("That email is used by another account.")}`);
  let role = str(fd, "role", 10) === "admin" ? "admin" : "user";
  if (id === admin.id) role = "admin"; // never lock yourself out
  await sql`UPDATE users SET name = ${name}, email = ${email}, phone = ${str(fd, "phone", 40)},
    headline = ${str(fd, "headline", 140)}, bio = ${str(fd, "bio", 2000)}, role = ${role} WHERE id = ${id}`;
  revalidatePath("/admin", "layout");
  redirect(`${back}?saved=1`);
}
