import { useState, useEffect, useCallback } from 'react';
import { sidPlayer, SIDTrack } from '@/lib/jssid';
import { toast } from '@/components/ui/use-toast';
import { SIDFile } from './useSIDDatabase';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
}

export const useSIDPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentSIDFile, setCurrentSIDFile] = useState<SIDFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chipModel, setChipModel] = useState<'6581' | '8580'>('6581');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        const current = sidPlayer.getCurrentTime();
        const total = sidPlayer.getDuration();
        const prog = sidPlayer.getProgress();
        
        setCurrentTime(current);
        setDuration(total);
        setProgress(prog);
        
        if (prog >= 100) {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const loadSIDFile = useCallback(async (sidFile: SIDFile) => {
    try {
      await sidPlayer.loadTrackFromUrl(sidFile.storage_url);
      
      const track: Track = {
        id: sidFile.id.toString(),
        title: sidFile.title,
        artist: sidFile.artist,
        duration: '3:00',
        plays: 0
      };
      
      setCurrentTrack(track);
      setCurrentSIDFile(sidFile);
      
      toast({
        title: 'SID File Loaded',
        description: `${sidFile.title} by ${sidFile.artist}`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load SID file:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SID file',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  const play = useCallback(() => {
    if (currentTrack) {
      sidPlayer.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    sidPlayer.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    sidPlayer.stop();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const changeChipModel = useCallback((model: '6581' | '8580') => {
    sidPlayer.setChipModel(model);
    setChipModel(model);
    toast({
      title: 'SID Chip Changed',
      description: `Now using ${model} chip model`,
    });
  }, []);

  const changePlaybackSpeed = useCallback((speed: number) => {
    sidPlayer.setPlaybackSpeed(speed);
    setPlaybackSpeed(speed);
    toast({
      title: 'Speed Changed',
      description: `Playback speed set to ${speed}x`,
    });
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isPlaying,
    currentTrack,
    currentSIDFile,
    progress,
    currentTime,
    duration,
    chipModel,
    playbackSpeed,
    loadSIDFile,
    play,
    pause,
    stop,
    togglePlayPause,
    changeChipModel,
    changePlaybackSpeed,
    formatTime
  };
};