import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SIDFile {
  id: number;
  filename: string;
  file_path: string;
  storage_url: string;
  title: string;
  artist: string;
  copyright?: string;
  release_year?: number;
  subsongs: number;
  default_subsong: number;
}

export interface Artist {
  id: number;
  name: string;
  lemon64_url?: string;
  csdb_url?: string;
  bio?: string;
  country?: string;
  active_years?: string;
}

export const useSIDDatabase = () => {
  const [sidFiles, setSidFiles] = useState<SIDFile[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSIDFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sid_files')
        .select('*')
        .order('filename');
      
      if (error) throw error;
      setSidFiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SID files');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setArtists(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artists');
    }
  };

  const syncFromSupabaseStorage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-sid-files');
      
      if (error) throw error;
      await fetchSIDFiles();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync from GitHub');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSIDFiles();
    fetchArtists();
  }, []);

  return {
    sidFiles,
    artists,
    loading,
    error,
    fetchSIDFiles,
    fetchArtists,
    syncFromSupabaseStorage
  };
};