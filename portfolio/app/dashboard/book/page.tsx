import { createBooking } from "@/lib/actions";
import { SERVICES } from "@/lib/constants";
import { Alert, Field } from "@/components/ui";

export default function BookPage({ searchParams }: { searchParams: { error?: string } }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-4xl font-bold">Book a website</h1>
      <p className="mb-6 text-ink/60">Tell us about your project and we&apos;ll review your request.</p>
      <form action={createBooking} className="card space-y-5">
        <Alert error={searchParams.error} />
        <fieldset>
          <legend className="label">Service</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s, i) => (
              <label key={s.id} className="flex cursor-pointer gap-3 rounded-xl border border-line p-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                <input type="radio" name="service" value={s.name} required defaultChecked={i === 0} className="mt-1 accent-[#c2410c]" />
                <span><span className="block text-sm font-semibold">{s.name}</span><span className="text-xs text-ink/60">{s.desc}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Project title" name="title" required placeholder="e.g. Website for my bakery" />
        <div>
          <label className="label" htmlFor="details">Project details</label>
          <textarea id="details" name="details" rows={6} required className="input"
            placeholder="Goals, pages needed, features, reference sites…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred completion date" name="preferred_date" type="date" min={today} required />
          <Field label="Budget (optional)" name="budget" placeholder="e.g. ₱30,000" />
        </div>
        <button className="btn btn-accent">Submit booking request</button>
      </form>
    </div>
  );
}
