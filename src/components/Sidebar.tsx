import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Library, Plus, Heart, Music, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentView }) => {
  const { playlists, createPlaylist } = useAppContext();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', key: 'home' },
    { icon: Search, label: 'Search', key: 'search' },
    { icon: Library, label: 'Your Library', key: 'library' },
    { icon: Clock, label: 'Recently Played', key: 'recent' },
    { icon: Heart, label: 'Liked Songs', key: 'liked' },
  ];

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreatePlaylist();
    } else if (e.key === 'Escape') {
      setShowCreateInput(false);
      setNewPlaylistName('');
    }
  };

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
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
              key={item.key}
              variant="ghost"
              onClick={() => onNavigate(item.key)}
              className={cn(
                'w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800',
                currentView === item.key && 'text-white bg-gray-800'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="px-3 mt-6">
          {showCreateInput ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Playlist name"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleCreatePlaylist}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowCreateInput(false);
                    setNewPlaylistName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowCreateInput(true)}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Plus className="mr-3 h-5 w-5" />
              Create Playlist
            </Button>
          )}
        </div>
        
        <ScrollArea className="flex-1 px-3 mt-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2">
              Your Playlists ({playlists.length})
            </div>
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                onClick={() => onNavigate(`playlist-${playlist.id}`)}
                className={cn(
                  'w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 text-sm',
                  currentView === `playlist-${playlist.id}` && 'text-white bg-gray-800'
                )}
              >
                <Music className="mr-3 h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="truncate">{playlist.name}</div>
                  <div className="text-xs text-gray-500">{playlist.tracks.length} tracks</div>
                </div>
              </Button>
            ))}
            {playlists.length === 0 && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No playlists yet.
                <br />Create your first playlist!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;