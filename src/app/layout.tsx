import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import AuthButtons from "@/components/AuthButtons";
import Badge from "@/components/ui/Badge";

export const metadata = { title: "MediQ — Campus Health" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = session?.role;

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white">
        <nav className="border-b border-neutral-800">
          <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-semibold">MediQ</Link>
              <Link href="/doctors" className="text-sm text-gray-300 hover:text-white">Doctors</Link>
              {session && <Link href="/me/appointments" className="text-sm text-gray-300 hover:text-white">My Appointments</Link>}
              {(role === "DOCTOR" || role === "ADMIN") && (
                <Link href="/doctor/dashboard" className="text-sm text-gray-300 hover:text-white">Doctor</Link>
              )}
              {role === "ADMIN" && <Link href="/admin" className="text-sm text-gray-300 hover:text-white">Admin</Link>}
            </div>
            <div className="flex items-center gap-3">
              {role && <Badge className="border-neutral-700 bg-neutral-900 text-gray-300">{role}</Badge>}
              <AuthButtons signedIn={!!session} />
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">{children}</main>
      </body>
    </html>
  );
}
