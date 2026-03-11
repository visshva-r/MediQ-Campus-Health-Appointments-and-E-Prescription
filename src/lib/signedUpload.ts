import { createClient } from '@supabase/supabase-js';

// We use the Service Role Key here to bypass RLS for secure server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function createSignedUpload(fileName: string) {
  // 1. Create a clean, unique file name so old files don't get overwritten
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePath = `${Date.now()}-${cleanFileName}`;
  
  // The name of the bucket you will create in Supabase
  const bucketName = 'prescriptions'; 

  // 2. Ask Supabase for a secure, temporary upload URL
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUploadUrl(uniquePath);

  if (error) {
    console.error("Supabase Storage Error:", error);
    throw new Error("Could not generate signed URL");
  }

  // 3. Construct the final public URL that the patient will click to view the file
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${uniquePath}`;

  return {
    signedUrl: data.signedUrl,
    publicUrl: publicUrl,
  };
}