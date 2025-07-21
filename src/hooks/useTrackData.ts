import { useState, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  lastPlayed?: Date;
}

interface ArtistInfo {
  name: string;
  realName?: string;
  country?: string;
  groups?: string[];
  bio?: string;
  lemon64Url?: string;
  csdbUrl?: string;
}

// Mock data - in real app would fetch from APIs
const mockTracks: Track[] = [
  { id: '1', title: 'Commando', artist: 'Rob Hubbard', duration: '3:24', plays: 15420 },
  { id: '2', title: 'The Last Ninja', artist: 'Matt Gray', duration: '4:12', plays: 12850 },
  { id: '3', title: 'Monty on the Run', artist: 'Rob Hubbard', duration: '2:58', plays: 11200 },
  { id: '4', title: 'Wizball', artist: 'Martin Galway', duration: '3:45', plays: 9800 },
  { id: '5', title: 'Cybernoid', artist: 'Jeroen Tel', duration: '3:18', plays: 8900 },
  { id: '6', title: 'Bubble Bobble', artist: 'David Whittaker', duration: '2:45', plays: 8200 },
  { id: '7', title: 'Turbo Outrun', artist: 'Jeroen Tel', duration: '4:01', plays: 7800 },
  { id: '8', title: 'Arkanoid', artist: 'Martin Galway', duration: '3:12', plays: 7500 }
];

const mockArtistInfo: Record<string, ArtistInfo> = {
  'Rob Hubbard': {
    name: 'Rob Hubbard',
    realName: 'Robert Hubbard',
    country: 'UK',
    bio: 'Legendary C64 composer known for innovative use of the SID chip',
    lemon64Url: 'https://www.lemon64.com/music/Rob_Hubbard',
    csdbUrl: 'https://csdb.dk/scener/?id=1234'
  },
  'Matt Gray': {
    name: 'Matt Gray',
    realName: 'Matthew Gray',
    country: 'UK', 
    groups: ['The Last Ninja Team'],
    bio: 'Composer for System 3, famous for The Last Ninja series',
    lemon64Url: 'https://www.lemon64.com/music/Matt_Gray'
  },
  'Martin Galway': {
    name: 'Martin Galway',
    country: 'UK',
    bio: 'Ocean Software composer, created many classic C64 soundtracks',
    lemon64Url: 'https://www.lemon64.com/music/Martin_Galway'
  },
  'Jeroen Tel': {
    name: 'Jeroen Tel',
    country: 'Netherlands',
    groups: ['Maniacs of Noise'],
    bio: 'Dutch composer known for technical excellence and innovation',
    lemon64Url: 'https://www.lemon64.com/music/Jeroen_Tel'
  }
};

export const useTrackData = () => {
  const [allTracks] = useState<Track[]>(mockTracks);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [artistInfo] = useState<Record<string, ArtistInfo>>(mockArtistInfo);

  // Initialize recent tracks with mock data
  useEffect(() => {
    const recent = mockTracks.slice(0, 5).map(track => ({
      ...track,
      lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
    }));
    setRecentTracks(recent);
  }, []);

  const addToRecent = (track: Track) => {
    setRecentTracks(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      const updated = [{ ...track, lastPlayed: new Date() }, ...filtered].slice(0, 20);
      return updated;
    });
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const getLikedTracks = (): Track[] => {
    return allTracks.filter(track => likedTracks.has(track.id));
  };

  const searchTracks = (query: string): Track[] => {
    if (!query.trim()) return allTracks;
    
    const lowercaseQuery = query.toLowerCase();
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getArtistInfo = (artistName: string): ArtistInfo | null => {
    return artistInfo[artistName] || null;
  };

  // Mock function to simulate fetching from external APIs
  const fetchArtistInfo = async (artistName: string): Promise<ArtistInfo | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation, would fetch from lemon64.com and csdb.dk
    const existing = artistInfo[artistName];
    if (existing) {
      return existing;
    }
    
    // Mock "not found" case
    return null;
  };

  return {
    allTracks,
    recentTracks,
    likedTracks,
    artistInfo,
    addToRecent,
    toggleLike,
    getLikedTracks,
    searchTracks,
    getArtistInfo,
    fetchArtistInfo
  };
};