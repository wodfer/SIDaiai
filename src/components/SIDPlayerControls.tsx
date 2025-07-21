import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Zap } from 'lucide-react';
import { useSIDPlayer } from '@/hooks/useSIDPlayer';

interface SIDPlayerControlsProps {
  className?: string;
}

const SIDPlayerControls: React.FC<SIDPlayerControlsProps> = ({ className }) => {
  const { chipModel, playbackSpeed, changeChipModel, changePlaybackSpeed } = useSIDPlayer();

  const handleChipToggle = (checked: boolean) => {
    const newModel = checked ? '8580' : '6581';
    changeChipModel(newModel);
  };

  const handleSpeedChange = (speed: number) => {
    changePlaybackSpeed(speed);
  };

  const speedButtons = [1, 1.5, 2, 3];

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-600" />
            <Label className="text-sm font-medium">SID Chip Model</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Label className={`text-xs ${chipModel === '6581' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
              6581
            </Label>
            <Switch
              checked={chipModel === '8580'}
              onCheckedChange={handleChipToggle}
              className="data-[state=checked]:bg-purple-600"
            />
            <Label className={`text-xs ${chipModel === '8580' ? 'font-bold text-purple-600' : 'text-gray-500'}`}>
              8580
            </Label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-orange-600" />
            <Label className="text-sm font-medium">Playback Speed</Label>
          </div>
          <div className="flex items-center space-x-1">
            {speedButtons.map((speed) => (
              <Button
                key={speed}
                variant={playbackSpeed === speed ? "default" : "outline"}
                size="sm"
                onClick={() => handleSpeedChange(speed)}
                className={`h-7 px-2 text-xs ${
                  playbackSpeed === speed 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'hover:bg-orange-50'
                }`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-2">
          <Badge variant="outline" className="text-xs">
            Current: {chipModel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Speed: {playbackSpeed}x
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SIDPlayerControls;