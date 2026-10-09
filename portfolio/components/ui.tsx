import Link from "next/link";
import { getUser } from "@/lib/auth";
import { logout } from "@/lib/actions";

const COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  Approved: "bg-emerald-100 text-emerald-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Completed: "bg-green-200 text-green-900",
  Rejected: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[status] ?? "bg-gray-100"}`}>
      {status}
    </span>
  );
}

export function Alert({ error, saved, msg }: { error?: string; saved?: string; msg?: string }) {
  if (error) return <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>;
  if (saved || msg) return <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{msg ?? "Saved."}</p>;
  return null;
}

export function Field({ label, name, defaultValue, type = "text", required, placeholder, min }: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean; placeholder?: string; min?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required={required}
        placeholder={placeholder} min={min} className="input" />
    </div>
  );
}

export async function SiteNav() {
  const user = await getUser();
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl font-bold">Folio<span className="text-accent">.</span></Link>
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn btn-ghost">
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </Link>
              <form action={logout}><button className="btn">Log out</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Log in</Link>
              <Link href="/register" className="btn btn-accent">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SideLayout({ title, links, children }: {
  title: string; links: { href: string; label: string }[]; children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[200px_1fr]">
      <aside>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink/50">{title}</p>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-white hover:shadow-sm">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

export const fmtDate = (s: string) =>
  new Date(s.length === 10 ? s + "T00:00:00" : s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
