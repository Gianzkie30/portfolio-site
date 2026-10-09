import Link from "next/link";
import { login } from "@/lib/actions";
import { Alert, Field } from "@/components/ui";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="mb-6 text-4xl font-bold">Welcome back</h1>
      <form action={login} className="card space-y-4">
        <Alert error={searchParams.error} />
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" required />
        <button className="btn btn-accent w-full">Log in</button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        No account? <Link href="/register" className="font-semibold text-accent">Register</Link>
      </p>
    </div>
  );
}
