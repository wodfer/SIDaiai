import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Cast, Settings } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useSIDPlayer } from '@/hooks/useSIDPlayer';
import { useChromecast } from '@/hooks/useChromecast';
import SIDPlayerControls from './SIDPlayerControls';

const PlayerControls: React.FC = () => {
  const { currentTrack, likedTracks, toggleLike, shareTrack, castTrack } = useAppContext();
  const { 
    isPlaying, 
    progress, 
    currentTime, 
    duration, 
    togglePlayPause, 
    formatTime 
  } = useSIDPlayer();
  const { isConnected } = useChromecast();
  const [volume, setVolume] = React.useState([75]);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleCast = async () => {
    if (currentTrack) {
      try {
        await castTrack(currentTrack);
      } catch (error) {
        console.error('Failed to cast:', error);
      }
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (!currentTrack) {
    return (
      <Card className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <p className="text-sm">No track selected</p>
            <p className="text-xs">Choose a track to start playing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 space-y-2">
      {showSettings && (
        <div className="px-4">
          <SIDPlayerControls />
        </div>
      )}
      
      <Card className="bg-white/95 backdrop-blur-sm border-t border-gray-200 rounded-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {currentTrack.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 truncate">{currentTrack.title}</h3>
                <p className="text-sm text-gray-600 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                size="icon"
                className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex-1 max-w-md space-y-1">
              <Slider
                value={[progress]}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLike(currentTrack.id)}
                className={`${likedTracks.has(currentTrack.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              >
                <Heart className={`h-4 w-4 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSettings}
                className={`${showSettings ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500'}`}
                title="SID Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {isConnected && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCast}
                  className="text-gray-600 hover:text-blue-500"
                  title="Cast to TV"
                >
                  <Cast className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => shareTrack(currentTrack)}
                className="text-gray-600 hover:text-purple-500"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2 ml-2">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerControls;