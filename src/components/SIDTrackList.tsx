import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Share2, Music2, Download } from 'lucide-react';
import { SIDFile } from '@/hooks/useSIDDatabase';
import { useSIDPlayer } from '@/hooks/useSIDPlayer';

interface SIDTrackListProps {
  title: string;
  sidFiles: SIDFile[];
  icon?: React.ReactNode;
  onSync?: () => void;
}

const SIDTrackList: React.FC<SIDTrackListProps> = ({ 
  title, 
  sidFiles, 
  icon = <Music2 className="h-5 w-5" />,
  onSync
}) => {
  const { 
    currentSIDFile,
    isPlaying,
    loadSIDFile,
    togglePlayPause
  } = useSIDPlayer();

  const handlePlay = async (sidFile: SIDFile) => {
    if (currentSIDFile?.id === sidFile.id && isPlaying) {
      togglePlayPause();
    } else {
      await loadSIDFile(sidFile);
      // Auto-play after loading
      setTimeout(() => {
        if (!isPlaying) {
          togglePlayPause();
        }
      }, 100);
    }
  };

  const handleDownload = (sidFile: SIDFile) => {
    window.open(sidFile.storage_url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
            <Badge variant="secondary">{sidFiles.length}</Badge>
          </CardTitle>
          {onSync && (
            <Button onClick={onSync} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Sync from GitHub
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sidFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Music2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No SID files found</p>
            {onSync && (
              <Button onClick={onSync} className="mt-4">
                Load SID Files from GitHub
              </Button>
            )}
          </div>
        ) : (
          sidFiles.map((sidFile) => (
            <Card 
              key={sidFile.id} 
              className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border-0 shadow-sm hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlay(sidFile)}
                      className={`h-10 w-10 rounded-full ${
                        currentSIDFile?.id === sidFile.id && isPlaying
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
                      } transition-all duration-300`}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{sidFile.title}</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600 truncate">{sidFile.artist}</p>
                        {sidFile.subsongs > 1 && (
                          <Badge variant="outline" className="text-xs">
                            {sidFile.subsongs} songs
                          </Badge>
                        )}
                      </div>
                      {sidFile.copyright && (
                        <p className="text-xs text-gray-500 truncate">{sidFile.copyright}</p>
                      )}
                    </div>
                    
                    {sidFile.release_year && (
                      <div className="text-sm text-gray-500">{sidFile.release_year}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(sidFile)}
                      className="h-8 w-8 text-gray-400 hover:text-blue-500"
                      title="Download SID file"
                    >
                      <Download className="h-4 w-4" />
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

export default SIDTrackList;