import Link from "next/link";
import { db, BookingWithClient } from "@/lib/db";
import { STATUSES } from "@/lib/constants";
import { StatusBadge, fmtDate } from "@/components/ui";

export default async function AdminBookings({ searchParams }: { searchParams: { status?: string } }) {
  const sql = await db();
  const filter = (STATUSES as readonly string[]).includes(searchParams.status ?? "") ? searchParams.status! : null;
  const rows = (filter
    ? await sql`SELECT b.id, b.title, b.service, b.status, b.preferred_date::text AS preferred_date,
        u.name AS client_name, u.email AS client_email FROM bookings b JOIN users u ON u.id = b.user_id
        WHERE b.status = ${filter} ORDER BY b.id DESC`
    : await sql`SELECT b.id, b.title, b.service, b.status, b.preferred_date::text AS preferred_date,
        u.name AS client_name, u.email AS client_email FROM bookings b JOIN users u ON u.id = b.user_id
        ORDER BY b.id DESC`) as BookingWithClient[];

  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold">Booking requests</h1>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/bookings" className={`btn ${filter ? "btn-ghost" : ""}`}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/bookings?status=${encodeURIComponent(s)}`} className={`btn ${filter === s ? "" : "btn-ghost"}`}>{s}</Link>
        ))}
      </div>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <tr><th className="p-4">Project</th><th>Client</th><th>Service</th><th>Due</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td colSpan={6} className="p-4 text-ink/60">No bookings found.</td></tr>}
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-paper">
                <td className="p-4 font-semibold">{b.title}</td>
                <td>{b.client_name}<br /><span className="text-ink/50">{b.client_email}</span></td>
                <td>{b.service}</td>
                <td>{fmtDate(b.preferred_date)}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className="pr-4 text-right"><Link href={`/admin/bookings/${b.id}`} className="font-semibold text-accent">Manage →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
