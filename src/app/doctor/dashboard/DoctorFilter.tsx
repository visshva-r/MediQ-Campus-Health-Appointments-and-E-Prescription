"use client";

type Doctor = { id: string; name: string; specialty: string };

export default function DoctorFilter({
  doctors,
  activeDoctorId,
}: {
  doctors: Doctor[];
  activeDoctorId: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Filter by doctor:</span>
      <select
        className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-sm"
        defaultValue={activeDoctorId}
        onChange={(e) => {
          const v = e.currentTarget.value;
          const url =
            v === ""
              ? "/doctor/dashboard"
              : `/doctor/dashboard?doctorId=${encodeURIComponent(v)}`;
          window.location.href = url;
        }}
      >
        <option value="">All doctors</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} — {d.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}
