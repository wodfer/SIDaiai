import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Loader2 } from 'lucide-react';
import { useChromecast } from '@/hooks/useChromecast';

interface CastDeviceListProps {
  onClose: () => void;
}

export const CastDeviceList: React.FC<CastDeviceListProps> = ({ onClose }) => {
  const { devices, isConnecting, connect, disconnect, currentDevice } = useChromecast();

  const handleDeviceClick = async (deviceId: string) => {
    if (currentDevice?.id === deviceId) {
      await disconnect();
    } else {
      await connect(deviceId);
    }
    onClose();
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Cast Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {devices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No cast devices found
          </p>
        ) : (
          devices.map((device) => (
            <Button
              key={device.id}
              variant={currentDevice?.id === device.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleDeviceClick(device.id)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4 mr-2" />
              )}
              {device.name}
              {currentDevice?.id === device.id && (
                <span className="ml-auto text-xs">Connected</span>
              )}
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  );
};