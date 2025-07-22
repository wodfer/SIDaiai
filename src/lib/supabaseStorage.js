import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://mecrdveeocgjsmmigdzb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Use env variable for security

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Recursively list all .sid files in the bucket.
 * @param {string} bucketName
 * @param {string} path
 * @returns {Promise<string[]>} list of relative file paths
 */
export async function listSidFilesRecursively(bucketName, path = '') {
  const sidFiles = [];
  let offset = 0;
  const limit = 1000;
  let keepGoing = true;

  while (keepGoing) {
    const { data, error } = await supabase.storage.from(bucketName).list(path, {
      limit,
      offset,
    });
    console.log('Listing:', { bucketName, path, offset, dataLength: data?.length, error });

    if (error) {
      console.error('Error listing files:', error);
      return sidFiles;
    }

    for (const item of data) {
      // It's a file if id is not null and name ends with .sid
      if (item.id && item.name.toLowerCase().endsWith('.sid')) {
        const filePath = path ? `${path}/${item.name}` : item.name;
        console.log('Found SID file:', filePath);
        sidFiles.push(filePath);
      }
      // It's a folder if id is null and metadata is null
      else if (item.id === null && item.metadata === null) {
        const subfolderPath = path ? `${path}/${item.name}` : item.name;
        console.log('Recursing into folder:', subfolderPath);
        const subfolderFiles = await listSidFilesRecursively(bucketName, subfolderPath);
        sidFiles.push(...subfolderFiles);
      }
    }

    if (!data || data.length < limit) {
      keepGoing = false;
    } else {
      offset += limit;
    }
  }

  return sidFiles;
}