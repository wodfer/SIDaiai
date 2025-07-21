import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

const MockAudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [duration] = useState(100); // Mock duration in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      // Simulate audio playback with progress updates
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            toast({ title: `Finished playing "${currentTrack.title}"` });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      // Show play notification
      toast({ 
        title: `Now playing: "${currentTrack.title}"`,
        description: `by ${currentTrack.artist}` 
      });
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack, setIsPlaying, duration]);

  // This component doesn't render anything visible
  // It just manages the mock audio playback state
  return null;
};

export default MockAudioPlayer;