import Link from "next/link";
import { notFound } from "next/navigation";
import { db, BookingWithClient } from "@/lib/db";
import { adminUpdateBooking } from "@/lib/actions";
import { STATUSES } from "@/lib/constants";
import { Alert, StatusBadge, fmtDate } from "@/components/ui";

export default async function AdminBookingDetail({ params, searchParams }: {
  params: { id: string }; searchParams: { error?: string; saved?: string };
}) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const sql = await db();
  const rows = (await sql`SELECT b.id, b.user_id, b.service, b.title, b.details, b.budget, b.status, b.admin_note,
    b.preferred_date::text AS preferred_date, to_char(b.created_at,'YYYY-MM-DD') AS created_at,
    u.name AS client_name, u.email AS client_email, u.phone AS client_phone
    FROM bookings b JOIN users u ON u.id = b.user_id WHERE b.id = ${id}`) as BookingWithClient[];
  const b = rows[0];
  if (!b) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/bookings" className="text-sm text-ink/60 hover:text-ink">← All bookings</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold">{b.title}</h1>
          <p className="text-ink/60">{b.service} · Requested {fmtDate(b.created_at)} · Preferred completion {fmtDate(b.preferred_date)}</p>
        </div>
        <StatusBadge status={b.status} />
      </div>

      <div className="card">
        <h2 className="mb-2 text-lg font-bold">Project details</h2>
        <p className="whitespace-pre-wrap text-sm">{b.details}</p>
        {b.budget && <p className="mt-3 text-sm text-ink/60">Budget: {b.budget}</p>}
      </div>

      <div className="card">
        <h2 className="mb-2 text-lg font-bold">Client</h2>
        <p className="text-sm">{b.client_name}</p>
        <p className="text-sm text-ink/60">{b.client_email}{b.client_phone && ` · ${b.client_phone}`}</p>
        <Link href={`/admin/users/${b.user_id}`} className="mt-2 inline-block text-sm font-semibold text-accent">Edit client information →</Link>
      </div>

      <form action={adminUpdateBooking} className="card space-y-4">
        <h2 className="text-lg font-bold">Manage booking</h2>
        <Alert error={searchParams.error} saved={searchParams.saved} msg="Booking updated." />
        <input type="hidden" name="id" value={b.id} />
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={b.status} className="input sm:w-60">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="admin_note">Note to client (visible on their booking)</label>
          <textarea id="admin_note" name="admin_note" rows={3} defaultValue={b.admin_note} className="input" />
        </div>
        <button className="btn btn-accent">Update booking</button>
      </form>
    </div>
  );
}
