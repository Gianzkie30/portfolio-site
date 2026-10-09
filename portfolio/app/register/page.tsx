import Link from "next/link";
import { register } from "@/lib/actions";
import { Alert, Field } from "@/components/ui";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="mb-6 text-4xl font-bold">Create your account</h1>
      <form action={register} className="card space-y-4">
        <Alert error={searchParams.error} />
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Password (min. 8 characters)" name="password" type="password" required />
        <button className="btn btn-accent w-full">Sign up</button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        Already registered? <Link href="/login" className="font-semibold text-accent">Log in</Link>
      </p>
    </div>
  );
}
