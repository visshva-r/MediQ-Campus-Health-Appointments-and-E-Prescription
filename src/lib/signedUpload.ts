// src/lib/signedUpload.ts
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export async function createSignedUpload(fileName: string) {
  const key = `rx/${Date.now()}-${fileName}`;
  const { data, error } = await client.storage.from("prescriptions").createSignedUploadUrl(key);
  if (error) throw error;
  return data; // { signedUrl, path }
}
