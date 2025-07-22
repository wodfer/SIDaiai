import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  'https://mecrdveeocgjsmmigdzb.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function testInsert() {
  await supabase
    .from('sid_files')
    .upsert(
      {
        storage_url: 'test_url',
        filename: 'test.sid',
        file_path: 'A/test.sid' // or whatever path is appropriate
      },
      { onConflict: 'storage_url' }
    );
}

testInsert(); 