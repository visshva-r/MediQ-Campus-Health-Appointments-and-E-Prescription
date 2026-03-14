import Link from "next/link";
import { getSession } from "@/lib/auth";
import Button from "@/components/ui/Button";

export default async function Home() {
  const session = await getSession();
  const email = session?.user?.email ?? "Guest";
  const role = session?.role ?? "ANON";

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">MediQ — Campus Health</h1>
      <p className="text-sm text-gray-400">
        Signed in as: {email} · Role: {role}
      </p>

      <div className="flex gap-3">
        <Link href="/doctors">
          <Button>Browse Doctors</Button>
        </Link>
        {session && (
          <Link href="/me/appointments">
            <Button variant="secondary">My Appointments</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
