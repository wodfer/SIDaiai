import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Cast, Wifi } from 'lucide-react';
import { useChromecast } from '@/hooks/useChromecast';
import { CastDeviceList } from './CastDeviceList';

interface CastButtonProps {
  className?: string;
}

export const CastButton: React.FC<CastButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAvailable, isConnected, currentDevice } = useChromecast();

  if (!isAvailable) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isConnected ? "default" : "ghost"}
          size="sm"
          className={className}
          title={isConnected ? `Connected to ${currentDevice?.name}` : 'Cast to device'}
        >
          {isConnected ? <Wifi className="h-4 w-4" /> : <Cast className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <CastDeviceList onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};