import Link from "next/link";
import { notFound } from "next/navigation";
import { db, Booking, Skill, User } from "@/lib/db";
import { adminUpdateUser } from "@/lib/actions";
import { Alert, Field, StatusBadge } from "@/components/ui";

export default async function AdminEditUser({ params, searchParams }: {
  params: { id: string }; searchParams: { error?: string; saved?: string };
}) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const sql = await db();
  const rows = (await sql`SELECT id, name, email, phone, headline, bio, role FROM users WHERE id = ${id}`) as User[];
  const u = rows[0];
  if (!u) notFound();
  const skills = (await sql`SELECT * FROM skills WHERE user_id = ${id} ORDER BY name`) as Skill[];
  const bookings = (await sql`SELECT id, title, status FROM bookings WHERE user_id = ${id} ORDER BY id DESC`) as Booking[];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/users" className="text-sm text-ink/60 hover:text-ink">← All users</Link>
      <h1 className="text-4xl font-bold">Edit {u.name}</h1>

      <form action={adminUpdateUser} className="card space-y-4">
        <Alert error={searchParams.error} saved={searchParams.saved} msg="User updated." />
        <input type="hidden" name="id" value={u.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" defaultValue={u.name} required />
          <Field label="Email address" name="email" type="email" defaultValue={u.email} required />
          <Field label="Phone number" name="phone" defaultValue={u.phone} />
          <Field label="Profile headline" name="headline" defaultValue={u.headline} />
        </div>
        <div>
          <label className="label" htmlFor="bio">Biography</label>
          <textarea id="bio" name="bio" rows={5} defaultValue={u.bio} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="role">Role</label>
          <select id="role" name="role" defaultValue={u.role} className="input sm:w-48">
            <option value="user">User</option><option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-accent">Save user</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 text-lg font-bold">Skills</h2>
          {skills.length === 0 ? <p className="text-sm text-ink/60">None.</p> : (
            <ul className="space-y-1 text-sm">{skills.map((s) => <li key={s.id}>{s.name} <span className="text-ink/40">· {s.level}</span></li>)}</ul>
          )}
        </div>
        <div className="card">
          <h2 className="mb-2 text-lg font-bold">Bookings</h2>
          {bookings.length === 0 ? <p className="text-sm text-ink/60">None.</p> : (
            <ul className="space-y-2 text-sm">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-2">
                  <Link href={`/admin/bookings/${b.id}`} className="font-semibold hover:text-accent">{b.title}</Link>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
