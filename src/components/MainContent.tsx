import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Heart, Share2, Music, TrendingUp, Clock, Users, Cast, Download } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useChromecast } from '@/hooks/useChromecast';
import { useTrackData } from '@/hooks/useTrackData';
import { useSIDPlayer } from '@/hooks/useSIDPlayer';
import { useSIDDatabase } from '@/hooks/useSIDDatabase';
import TrackList from './TrackList';
import SIDTrackList from './SIDTrackList';

interface MainContentProps {
  searchQuery: string;
  currentView: string;
}

const MainContent: React.FC<MainContentProps> = ({ searchQuery, currentView }) => {
  const { toggleLike, likedTracks, shareTrack, castTrack } = useAppContext();
  const { isConnected } = useChromecast();
  const { allTracks, recentTracks, getLikedTracks, searchTracks } = useTrackData();
  const { loadAndPlayTrack, isPlaying, currentTrack } = useSIDPlayer();
  const { sidFiles, loading, syncFromSupabaseStorage } = useSIDDatabase();

  const handleSync = async () => {
    try {
      await syncFromSupabaseStorage();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'recent':
        return (
          <div className="space-y-6">
            <TrackList 
              title="Recently Played" 
              tracks={recentTracks} 
              icon={<Clock className="h-5 w-5 text-blue-600" />}
              variant="recent"
            />
          </div>
        );
      
      case 'liked':
        return (
          <div className="space-y-6">
            <TrackList 
              title="Liked Songs" 
              tracks={getLikedTracks()} 
              icon={<Heart className="h-5 w-5 text-red-600" />}
              variant="liked"
            />
          </div>
        );
      
      case 'search':
        const searchResults = searchTracks(searchQuery);
        return (
          <div className="space-y-6">
            <TrackList 
              title={searchQuery ? `Search Results for "${searchQuery}"` : 'All Tracks'} 
              tracks={searchResults}
              icon={<Music className="h-5 w-5 text-purple-600" />}
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">SID Files</p>
                      <p className="text-2xl font-bold">{sidFiles.length}</p>
                    </div>
                    <Music className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Artists</p>
                      <p className="text-2xl font-bold">4,500+</p>
                    </div>
                    <Users className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Trending</p>
                      <p className="text-2xl font-bold">Rising</p>
                    </div>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Recently Played</p>
                      <p className="text-2xl font-bold">{recentTracks.length}</p>
                    </div>
                    <Clock className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <SIDTrackList 
              title="SID Files from GitHub" 
              sidFiles={sidFiles} 
              icon={<Music className="h-5 w-5 text-purple-500" />}
              onSync={handleSync}
            />
          </div>
        );
    }
  };

  return (
    <div className="p-6 pb-32">
      {loading && <div className="text-center py-4">Loading SID files...</div>}
      {renderView()}
    </div>
  );
};

export default MainContent;