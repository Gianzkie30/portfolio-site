import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/lib/actions";
import { Alert, Field } from "@/components/ui";

export default async function ProfilePage({ searchParams }: { searchParams: { error?: string; saved?: string } }) {
  const u = await requireUser();
  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Personal information</h1>
      <form action={updateProfile} className="card max-w-2xl space-y-4">
        <Alert error={searchParams.error} saved={searchParams.saved} msg="Profile updated." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" defaultValue={u.name} required />
          <Field label="Email address" name="email" type="email" defaultValue={u.email} required />
          <Field label="Phone number" name="phone" type="tel" defaultValue={u.phone} />
          <Field label="Profile headline" name="headline" defaultValue={u.headline} placeholder="e.g. Freelance photographer" />
        </div>
        <div>
          <label className="label" htmlFor="bio">Biography</label>
          <textarea id="bio" name="bio" rows={6} defaultValue={u.bio} className="input" />
        </div>
        <button className="btn btn-accent">Save changes</button>
      </form>
    </div>
  );
}
