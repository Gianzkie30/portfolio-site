import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db, Booking } from "@/lib/db";
import { Alert, StatusBadge, fmtDate } from "@/components/ui";
import { STATUSES } from "@/lib/constants";

export default async function MyBookings({ searchParams }: { searchParams: { created?: string } }) {
  const user = await requireUser();
  const sql = await db();
  const bookings = (await sql`SELECT id, service, title, details, budget, status, admin_note,
    preferred_date::text AS preferred_date, to_char(created_at,'YYYY-MM-DD') AS created_at,
    to_char(updated_at,'YYYY-MM-DD') AS updated_at
    FROM bookings WHERE user_id = ${user.id} ORDER BY id DESC`) as Booking[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">My bookings</h1>
        <Link href="/dashboard/book" className="btn btn-accent">New booking</Link>
      </div>
      <Alert msg={searchParams.created ? "Booking submitted! We'll review it shortly." : undefined} />
      {bookings.length === 0 ? (
        <div className="card text-sm text-ink/60">You have no bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const step = STATUSES.indexOf(b.status as (typeof STATUSES)[number]);
            return (
              <article key={b.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{b.title}</h2>
                    <p className="text-sm text-ink/60">{b.service} · Requested {fmtDate(b.created_at)} · Due {fmtDate(b.preferred_date)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{b.details}</p>
                {b.budget && <p className="mt-2 text-sm text-ink/60">Budget: {b.budget}</p>}
                {b.status !== "Rejected" && (
                  <div className="mt-4 flex gap-1" aria-label="Progress">
                    {STATUSES.filter((s) => s !== "Rejected").map((s, i) => (
                      <div key={s} title={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`} />
                    ))}
                  </div>
                )}
                {b.admin_note && (
                  <p className="mt-4 rounded-lg bg-paper p-3 text-sm"><span className="font-semibold">Note from admin:</span> {b.admin_note}</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
