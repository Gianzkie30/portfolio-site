import "./globals.css";
import type { Metadata } from "next";
import { SiteNav } from "@/components/ui";

export const metadata: Metadata = {
  title: "Folio — Portfolio & Website Booking",
  description: "Build your portfolio, showcase your skills, and book a website project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <footer className="mt-16 border-t border-line py-8 text-center text-sm text-ink/50">
          © {new Date().getFullYear()} Folio. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
