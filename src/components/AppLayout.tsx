import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Menu, Search, Bell, User, Home, Library, Plus, Heart, Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import MainContent from './MainContent';
import MockAudioPlayer from './MockAudioPlayer';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar, currentTrack, isPlaying, setIsPlaying } = useAppContext();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(75);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search', active: false },
    { icon: Library, label: 'Your Library', active: false },
  ];

  const playlists = ['Liked Songs', 'C64 Classics', 'Chiptune Favorites', 'Demo Scene Hits', 'Game Music'];

  return (
    <div className="flex h-screen bg-gray-50">
      <MockAudioPlayer />
      
      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SID Player
              </h1>
            </div>
          </div>
          
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  'w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800',
                  item.active && 'text-white bg-gray-800'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="px-3 mt-6">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Plus className="mr-3 h-5 w-5" />
              Create Playlist
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Heart className="mr-3 h-5 w-5" />
              Liked Songs
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-3 mt-4">
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Button
                  key={playlist}
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 text-sm"
                >
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for SID tracks, artists, or composers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <MainContent searchQuery={searchQuery} />
        </main>
        
        {/* Player Controls */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20 h-12 w-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 mx-8">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={(value) => setCurrentTime(value[0])}
                  className="flex-1"
                />
                <span className="text-sm">{formatTime(duration)}</span>
              </div>
              {currentTrack && (
                <div className="text-center text-sm mt-1">
                  <span className="font-medium">{currentTrack.title}</span> - {currentTrack.artist}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;