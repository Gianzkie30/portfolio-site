import Link from "next/link";
import { db, User } from "@/lib/db";
import { fmtDate } from "@/components/ui";

export default async function AdminUsers() {
  const sql = await db();
  const users = (await sql`SELECT id, name, email, phone, headline, bio, role, to_char(created_at,'YYYY-MM-DD') AS created_at FROM users ORDER BY id DESC`) as User[];
  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Users</h1>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <tr><th className="p-4">Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-paper">
                <td className="p-4 font-semibold">{u.name}<br /><span className="font-normal text-ink/50">{u.headline}</span></td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{fmtDate(u.created_at)}</td>
                <td className="pr-4 text-right"><Link href={`/admin/users/${u.id}`} className="font-semibold text-accent">Edit →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
