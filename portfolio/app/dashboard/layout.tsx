import { requireUser } from "@/lib/auth";
import { SideLayout } from "@/components/ui";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <SideLayout title="My account" links={[
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/profile", label: "Personal info" },
      { href: "/dashboard/skills", label: "Skills" },
      { href: "/dashboard/book", label: "Book a website" },
      { href: "/dashboard/bookings", label: "My bookings" },
    ]}>
      {children}
    </SideLayout>
  );
}
