import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useSIDPlayer } from '@/hooks/useSIDPlayer';
import { Play, Pause, Volume2, Wifi, Heart, Share2, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const TestingPanel: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    toggleLike,
    likedTracks,
    shareTrack,
    castTrack,
    sidebarOpen,
    toggleSidebar
  } = useAppContext();

  const {
    loadHVSCTrack,
    togglePlayPause,
    chipModel,
    playbackSpeed,
    changeChipModel,
    changePlaybackSpeed
  } = useSIDPlayer();

  const hvscTrack = {
    id: 'hvsc-sunny-day',
    title: 'A Sunny Day',
    artist: 'Blues Muz / Nordboe Kjell',
    duration: '3:00',
    plays: 42
  };

  const loadHVSCFile = async () => {
    try {
      toast({
        title: 'Loading SID File',
        description: 'Fetching from HVSC collection...',
      });
      
      await loadHVSCTrack(
        'https://www.hvsc.c64.org/MUSICIANS/B/Blues_Muz/Nordboe_Kjell/A_Sunny_Day.sid',
        hvscTrack
      );
      
      toast({
        title: 'SID File Loaded',
        description: 'A Sunny Day by Blues Muz is ready to play!',
      });
    } catch (error) {
      toast({
        title: 'Load Failed',
        description: 'Could not load SID file. Check console for details.',
        variant: 'destructive'
      });
    }
  };

  const testFunctions = [
    {
      name: 'Load HVSC SID File',
      action: loadHVSCFile,
      status: 'Ready',
      icon: Download
    },
    {
      name: 'Toggle Sidebar',
      action: toggleSidebar,
      status: sidebarOpen ? 'Open' : 'Closed',
      icon: Volume2
    },
    {
      name: 'Play/Pause',
      action: togglePlayPause,
      status: isPlaying ? 'Playing' : 'Paused',
      icon: isPlaying ? Pause : Play
    },
    {
      name: 'Like Track',
      action: () => currentTrack && toggleLike(currentTrack.id),
      status: currentTrack && likedTracks.has(currentTrack.id) ? 'Liked' : 'Not Liked',
      icon: Heart
    },
    {
      name: 'Share Track',
      action: () => currentTrack && shareTrack(currentTrack),
      status: 'Ready',
      icon: Share2
    },
    {
      name: 'Cast to TV',
      action: () => currentTrack && castTrack(currentTrack),
      status: 'Ready',
      icon: Wifi
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          SID Player Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTrack && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
            <p className="text-sm font-medium">Now Playing:</p>
            <p className="text-lg font-bold">{currentTrack.title}</p>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={isPlaying ? 'default' : 'secondary'}>
                {isPlaying ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                {isPlaying ? 'Playing' : 'Paused'}
              </Badge>
              <Badge variant="outline">
                SID {chipModel}
              </Badge>
              <Badge variant="outline">
                {playbackSpeed}x Speed
              </Badge>
              {likedTracks.has(currentTrack.id) && (
                <Badge variant="outline">
                  <Heart className="h-3 w-3 mr-1 fill-current" />
                  Liked
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testFunctions.map((test, index) => {
            const Icon = test.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">{test.name}</p>
                    <p className="text-xs text-muted-foreground">Status: {test.status}</p>
                  </div>
                </div>
                <Button size="sm" onClick={test.action} variant="outline">
                  Test
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={chipModel === '6581' ? 'default' : 'outline'}
            onClick={() => changeChipModel('6581')}
          >
            SID 6581
          </Button>
          <Button 
            size="sm" 
            variant={chipModel === '8580' ? 'default' : 'outline'}
            onClick={() => changeChipModel('8580')}
          >
            SID 8580
          </Button>
        </div>
        
        <div className="flex gap-2">
          {[1, 1.5, 2, 3].map(speed => (
            <Button 
              key={speed}
              size="sm" 
              variant={playbackSpeed === speed ? 'default' : 'outline'}
              onClick={() => changePlaybackSpeed(speed)}
            >
              {speed}x
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium mb-2">HVSC SID File Testing:</p>
          <ul className="space-y-1 text-xs">
            <li>• Load the actual SID file: A Sunny Day by Blues Muz</li>
            <li>• Test SID chip model switching (6581 vs 8580)</li>
            <li>• Try different playback speeds (1x to 3x)</li>
            <li>• Verify all player controls work with real SID data</li>
            <li>• URL: https://www.hvsc.c64.org/MUSICIANS/B/Blues_Muz/Nordboe_Kjell/A_Sunny_Day.sid</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingPanel;