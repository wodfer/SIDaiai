import { supabase } from '../src/lib/supabaseStorage.js';
import dotenv from 'dotenv';
dotenv.config();

async function testSingleUpsert() {
  const bucketName = 'sids';
  const baseUrl = 'https://mecrdveeocgjsmmigdzb.supabase.co/storage/v1/object/public';
  const targetFile = 'test.sid';

  // List only the root directory
  const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1000 });
  if (error) {
    console.error('Error listing root directory:', error);
    return;
  }

  // Find test.sid in the root
  const testSid = data.find(item => item.name === targetFile && item.id);
  if (testSid) {
    const filePath = targetFile;
    const url = `${baseUrl}/${bucketName}/${filePath}`;
    const filename = targetFile;
    const { data: upsertData, error: upsertError } = await supabase
      .from('sid_files')
      .upsert(
        { storage_url: url, filename, file_path: filePath },
        { onConflict: 'storage_url' }
      );
    console.log('Upsert result for test.sid:', { upsertData, upsertError, url, filename, filePath });
  } else {
    console.log('test.sid not found in root directory.');
  }
}

testSingleUpsert(); 