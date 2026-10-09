import Link from "next/link";
import { db, BookingWithClient } from "@/lib/db";
import { STATUSES } from "@/lib/constants";
import { StatusBadge, fmtDate } from "@/components/ui";

export default async function AdminHome() {
  const sql = await db();
  const counts = await sql`SELECT status, count(*)::int AS n FROM bookings GROUP BY status`;
  const users = await sql`SELECT count(*)::int AS n FROM users`;
  const byStatus: Record<string, number> = Object.fromEntries(counts.map((c) => [c.status as string, c.n as number]));
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const recent = (await sql`SELECT b.id, b.title, b.service, b.status, b.preferred_date::text AS preferred_date,
    u.name AS client_name FROM bookings b JOIN users u ON u.id = b.user_id
    ORDER BY b.id DESC LIMIT 6`) as BookingWithClient[];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><p className="label">Users</p><p className="font-display text-4xl font-bold">{users[0].n}</p></div>
        <div className="card"><p className="label">Total requests</p><p className="font-display text-4xl font-bold">{total}</p></div>
        <div className="card"><p className="label">Awaiting action</p>
          <p className="font-display text-4xl font-bold">{(byStatus["Pending"] ?? 0) + (byStatus["In Review"] ?? 0)}</p></div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-xl font-bold">Requests by status</h2>
        <div className="flex flex-wrap gap-3">
          {STATUSES.map((s) => (
            <Link key={s} href={`/admin/bookings?status=${encodeURIComponent(s)}`} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 hover:bg-paper">
              <StatusBadge status={s} /> <span className="font-bold">{byStatus[s] ?? 0}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Latest requests</h2>
          <Link href="/admin/bookings" className="btn btn-ghost">View all</Link>
        </div>
        {recent.length === 0 ? <p className="text-sm text-ink/60">No requests yet.</p> : (
          <ul className="divide-y divide-line">
            {recent.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-paper">
                  <div><p className="font-semibold">{b.title}</p><p className="text-ink/60">{b.client_name} · {b.service} · due {fmtDate(b.preferred_date)}</p></div>
                  <StatusBadge status={b.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
