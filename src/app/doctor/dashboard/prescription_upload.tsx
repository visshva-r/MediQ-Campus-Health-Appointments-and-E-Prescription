"use client";
import { useState } from "react";

export default function PrescriptionUpload({ appointmentId }: { appointmentId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setUploading(true);

    try {
      const urlRes = await fetch("/api/prescriptions/signed-url", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name }),
        headers: { "Content-Type": "application/json" },
      });
      const { data } = await urlRes.json();
      
      const { signedUrl, publicUrl } = data; 

      await fetch(signedUrl, {
        method: "PUT", 
        body: file,
        headers: { "Content-Type": file.type },
      });

      await fetch("/api/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointmentId,
          fileUrl: publicUrl, 
        }),
        headers: { "Content-Type": "application/json" },
      });

      alert("Prescription uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload.");
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