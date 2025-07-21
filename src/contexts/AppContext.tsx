import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useChromecast } from '@/hooks/useChromecast';
import { useTrackData } from '@/hooks/useTrackData';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
  isPublic: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  playlists: Playlist[];
  likedTracks: string[];
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: User | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  playlists: Playlist[];
  likedTracks: Set<string>;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleLike: (trackId: string) => void;
  createPlaylist: (name: string) => void;
  shareTrack: (track: Track) => void;
  castTrack: (track: Track) => Promise<void>;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentUser: null,
  currentTrack: null,
  isPlaying: false,
  playlists: [],
  likedTracks: new Set(),
  setCurrentTrack: () => {},
  setIsPlaying: () => {},
  toggleLike: () => {},
  createPlaylist: () => {},
  shareTrack: () => {},
  castTrack: async () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { castTrack: castToDevice, isConnected } = useChromecast();
  const { likedTracks, toggleLike: toggleTrackLike } = useTrackData();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleLike = (trackId: string) => {
    toggleTrackLike(trackId);
    const isLiked = likedTracks.has(trackId);
    toast({ 
      title: isLiked ? 'Removed from liked songs' : 'Added to liked songs' 
    });
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
      isPublic: false,
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    toast({ title: `Playlist "${name}" created` });
  };

  const shareTrack = (track: Track) => {
    const shareText = `Check out "${track.title}" by ${track.artist} on SID Player! 🎵`;
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({ title: 'Share link copied to clipboard!' });
    }
  };

  const castTrack = async (track: Track) => {
    try {
      await castToDevice(track);
      toast({ title: `Casting "${track.title}" to TV` });
    } catch (error) {
      toast({ 
        title: 'Cast failed', 
        description: 'Please check your connection and try again',
        variant: 'destructive'
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        currentTrack,
        isPlaying,
        playlists,
        likedTracks,
        setCurrentTrack,
        setIsPlaying,
        toggleLike,
        createPlaylist,
        shareTrack,
        castTrack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};