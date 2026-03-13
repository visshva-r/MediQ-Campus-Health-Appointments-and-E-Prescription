import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { fmtDateTime, fmtTime } from "@/lib/date";
import { revalidatePath } from "next/cache";
import PrescriptionUpload from "./prescription_upload";
import DoctorFilter from "./DoctorFilter";

export const dynamic = "force-dynamic";

type SearchParams = {
  doctorId?: string;
};

export default async function DoctorDashboard({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await requireRole("DOCTOR"); // ADMIN also passes via requireRole
  const role = (session as any)?.role ?? "STUDENT";

  // ---- server actions for status updates ----
  async function setStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "PENDING") as
      | "PENDING"
      | "CONFIRMED"
      | "COMPLETED"
      | "CANCELLED";
    if (!id) return;

    await prisma.appointment.update({ where: { id }, data: { status } });

    // Refresh the dashboard immediately after clicking a button
    revalidatePath("/doctor/dashboard");
  }

  // If the viewer is ADMIN, allow filtering by doctor via ?doctorId=
  const isAdmin = role === "ADMIN";
  const now = new Date();

  const activeDoctorId = isAdmin ? searchParams?.doctorId : undefined;

  const where: any = {
    slot: { start: { gte: now } },
  };

  if (activeDoctorId) {
    where.doctorId = activeDoctorId;
  }

  const [appts, doctors] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { user: true, doctor: true, slot: true },
      take: 100,
    }),
    isAdmin
      ? prisma.doctor.findMany({ orderBy: { name: "asc" } })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>

        {isAdmin && doctors.length > 0 && (
          <DoctorFilter
            doctors={doctors}
            activeDoctorId={activeDoctorId ?? ""}
          />
        )}
      </div>

      {appts.length === 0 ? (
        <div className="rounded border p-4 text-sm text-gray-400">
          No upcoming appointments.
        </div>
      ) : (
        <ul className="space-y-2">
          {appts.map((a: any) => (
            <li key={a.id} className="rounded border p-4 space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-lg text-emerald-600">
                  {a.user?.name || a.user?.email || "Student"}
                </div>

                <div className="text-xs px-2 py-1 rounded border">
                  {a.status}
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {fmtDateTime(new Date(a.slot.start))} —{" "}
                {fmtTime(new Date(a.slot.end))}
              </div>

              {a.reason && <div className="text-sm">Reason: {a.reason}</div>}

              <div className="pt-2 pb-1">
                {a.prescriptionUrl ? (
                  <a
                    href={a.prescriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 font-medium hover:underline"
                  >
                    📄 View Uploaded Prescription
                  </a>
                ) : (
                  <PrescriptionUpload appointmentId={a.id} />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="CONFIRMED" />
                  <button className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500">
                    Confirm
                  </button>
                </form>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="COMPLETED" />
                  <button className="px-3 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-500">
                    Complete
                  </button>
                </form>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="CANCELLED" />
                  <button className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-500">
                    Cancel
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}