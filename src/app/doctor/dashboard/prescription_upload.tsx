"use client";
import { useState } from "react";

export default function PrescriptionUpload({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const urlRes = await fetch("/api/prescriptions/signed-url", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name }),
        headers: { "Content-Type": "application/json" },
      });
      if (!urlRes.ok) {
        throw new Error("Could not get upload URL");
      }
      const { data } = await urlRes.json();

      const { signedUrl, publicUrl } = data;

      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const saveRes = await fetch("/api/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointmentId,
          fileUrl: publicUrl,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save prescription in database");
      }

      setSuccess("Prescription uploaded successfully.");
    } catch (error) {
      console.error("Upload failed", error);
      setError("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm mt-4">
      <h3 className="font-semibold mb-2 text-black">Upload Prescription</h3>
      <input
        type="file"
        accept=".pdf, image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2 block w-full text-sm text-gray-500"
      />
      {error && (
        <p className="mb-1 text-xs text-red-500">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-1 text-xs text-emerald-600">
          {success}
        </p>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Save Prescription"}
      </button>
    </div>
  );
}