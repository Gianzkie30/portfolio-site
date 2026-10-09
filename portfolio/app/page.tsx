import Link from "next/link";
import { SERVICES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="py-20 md:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Portfolio · Skills · Web projects</p>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] md:text-7xl">
          Your work, <em className="text-accent">beautifully</em> presented.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Create your profile, showcase your skills, and book a custom website — then follow your project
          from first request to launch.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/register" className="btn btn-accent px-6 py-3">Create your account</Link>
          <Link href="/login" className="btn btn-ghost px-6 py-3">Log in</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Website services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <div key={s.id} className="card transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="font-display text-3xl text-accent">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{s.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["1. Sign up", "Create your account in under a minute."],
          ["2. Book", "Choose a service, describe your project and pick a date."],
          ["3. Track", "Watch your booking move from Pending to Completed."],
        ].map(([t, d]) => (
          <div key={t} className="border-t-2 border-ink pt-4">
            <h3 className="text-lg font-bold">{t}</h3>
            <p className="text-sm text-ink/70">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
