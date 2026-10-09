import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db, Booking, Skill } from "@/lib/db";
import { StatusBadge, fmtDate } from "@/components/ui";

export default async function Overview() {
  const user = await requireUser();
  const sql = await db();
  const skills = (await sql`SELECT * FROM skills WHERE user_id = ${user.id} ORDER BY name`) as Skill[];
  const bookings = (await sql`SELECT id, service, title, status, preferred_date::text AS preferred_date,
    to_char(created_at,'YYYY-MM-DD') AS created_at FROM bookings WHERE user_id = ${user.id}
    ORDER BY id DESC`) as Booking[];
  const active = bookings.filter((b) => !["Completed", "Rejected"].includes(b.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Hello, {user.name.split(" ")[0]}</h1>
        <p className="text-ink/60">{user.headline || "Add a headline in your personal info to complete your profile."}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[["Skills", skills.length], ["Total bookings", bookings.length], ["Active bookings", active]].map(([l, v]) => (
          <div key={l as string} className="card">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{l}</p>
            <p className="font-display text-4xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent bookings</h2>
          <Link href="/dashboard/book" className="btn btn-accent">New booking</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm text-ink/60">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {bookings.slice(0, 4).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div><p className="font-semibold">{b.title}</p><p className="text-ink/60">{b.service} · due {fmtDate(b.preferred_date)}</p></div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Skills</h2>
          <Link href="/dashboard/skills" className="btn btn-ghost">Manage</Link>
        </div>
        {skills.length === 0 ? <p className="text-sm text-ink/60">No skills added yet.</p> : (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
                {s.name} <span className="text-ink/40">· {s.level}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
