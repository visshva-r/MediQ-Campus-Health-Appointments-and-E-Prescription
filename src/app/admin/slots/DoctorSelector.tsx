"use client";

type Doctor = { id: string; name: string; specialty: string };

export default function DoctorSelector({
  doctors,
  activeDoctorId,
}: {
  doctors: Doctor[];
  activeDoctorId: string;
}) {
  return (
    <select
      className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
      defaultValue={activeDoctorId}
      onChange={(e) => {
        const v = e.currentTarget.value;
        window.location.href = `/admin/slots?doctorId=${v}`;
      }}
    >
      {doctors.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name} — {d.specialty}
        </option>
      ))}
    </select>
  );
}
