import { requireAdmin } from "@/lib/auth";
import { SideLayout } from "@/components/ui";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <SideLayout title="Administration" links={[
      { href: "/admin", label: "Overview" },
      { href: "/admin/bookings", label: "All bookings" },
      { href: "/admin/users", label: "Users" },
    ]}>
      {children}
    </SideLayout>
  );
}
