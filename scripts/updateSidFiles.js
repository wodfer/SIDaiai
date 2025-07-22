import { supabase, listSidFilesRecursively } from '../src/lib/supabaseStorage.js';
import dotenv from 'dotenv';
dotenv.config();
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
async function updateSidFilesInDB() {
  const bucketName = 'sids';
  const baseUrl = 'https://mecrdveeocgjsmmigdzb.supabase.co/storage/v1/object/public';

  // 1. Get all sid file paths
  const sidFiles = await listSidFilesRecursively(bucketName);
  console.log('sidFiles:', sidFiles);

  // 2. Convert paths to full URLs
  const sidFileUrls = sidFiles.map((filePath) => `${baseUrl}/${bucketName}/${filePath}`);

  // 3. For example, upsert into a "sid_files" table with columns: id (uuid), url (text)
  // You may want to clear old entries first or do upsert by unique constraint

  if (sidFiles.length > 0) {
    const filePath = sidFiles[0];
    const url = `${baseUrl}/${bucketName}/${filePath}`;
    const filename = filePath.split('/').pop();
    const { data, error } = await supabase
      .from('sid_files')
      .upsert(
        { storage_url: url, filename, file_path: filePath },
        { onConflict: 'storage_url' }
      );
    console.log('Single upsert result:', { data, error, url, filename, filePath });
  }

  for (const filePath of sidFiles) {
    const url = `${baseUrl}/${bucketName}/${filePath}`;
    const filename = filePath.split('/').pop();
    console.log('Attempting upsert:', { storage_url: url, filename, file_path: filePath });
    const { data, error } = await supabase
      .from('sid_files')
      .upsert(
        { storage_url: url, filename, file_path: filePath },
        { onConflict: 'storage_url' }
      );
    console.log('Upsert result:', { data, error, url, filename, filePath });
    if (error) {
      console.error('Error upserting:', error, url);
    } else {
      console.log('Upserted:', url);
    }
  }

  console.log(`Updated ${sidFileUrls.length} SID files in DB.`);
}

updateSidFilesInDB()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
