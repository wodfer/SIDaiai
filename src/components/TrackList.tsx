import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Share2, Cast, Clock, Music2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useChromecast } from '@/hooks/useChromecast';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  lastPlayed?: Date;
}

interface TrackListProps {
  title: string;
  tracks: Track[];
  icon?: React.ReactNode;
  variant?: 'default' | 'liked' | 'recent';
}

const TrackList: React.FC<TrackListProps> = ({ 
  title, 
  tracks, 
  icon = <Music2 className="h-5 w-5" />, 
  variant = 'default' 
}) => {
  const { 
    currentTrack, 
    setCurrentTrack, 
    setIsPlaying, 
    isPlaying, 
    toggleLike, 
    likedTracks, 
    shareTrack, 
    castTrack 
  } = useAppContext();
  const { isConnected } = useChromecast();

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleCast = async (track: Track) => {
    try {
      await castTrack(track);
    } catch (error) {
      console.error('Failed to cast track:', error);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'liked':
        return 'hover:from-red-50 hover:to-pink-50';
      case 'recent':
        return 'hover:from-blue-50 hover:to-indigo-50';
      default:
        return 'hover:from-purple-50 hover:to-pink-50';
    }
  };

  const formatLastPlayed = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary">{tracks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tracks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Music2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tracks found</p>
          </div>
        ) : (
          tracks.map((track) => (
            <Card 
              key={track.id} 
              className={`group hover:bg-gradient-to-r ${getVariantStyles()} transition-all duration-300 border-0 shadow-sm hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlay(track)}
                      className={`h-10 w-10 rounded-full ${
                        currentTrack?.id === track.id && isPlaying
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
                      } transition-all duration-300`}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                        {variant === 'recent' && track.lastPlayed && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatLastPlayed(track.lastPlayed)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">{track.duration}</div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLike(track.id)}
                      className={`h-8 w-8 ${likedTracks.has(track.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart className={`h-4 w-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                    </Button>
                    {isConnected && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCast(track)}
                        className="h-8 w-8 text-gray-400 hover:text-blue-500"
                        title="Cast to TV"
                      >
                        <Cast className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => shareTrack(track)}
                      className="h-8 w-8 text-gray-400 hover:text-purple-500"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TrackList;