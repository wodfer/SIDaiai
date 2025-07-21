import { useState, useEffect, useCallback } from 'react';

interface CastDevice {
  id: string;
  name: string;
  status: 'available' | 'connected' | 'connecting';
}

interface UseChromecastReturn {
  isAvailable: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  devices: CastDevice[];
  currentDevice: CastDevice | null;
  connect: (deviceId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  castTrack: (track: any) => Promise<void>;
}

export const useChromecast = (): UseChromecastReturn => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [devices, setDevices] = useState<CastDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<CastDevice | null>(null);

  useEffect(() => {
    // Check if Cast API is available
    const checkCastAvailability = () => {
      if (window.chrome && window.chrome.cast) {
        setIsAvailable(true);
        initializeCast();
      } else {
        // Simulate cast availability for development
        setIsAvailable(true);
        setDevices([
          { id: '1', name: 'Living Room TV', status: 'available' },
          { id: '2', name: 'Bedroom Chromecast', status: 'available' },
        ]);
      }
    };

    checkCastAvailability();
  }, []);

  const initializeCast = useCallback(() => {
    // Initialize Cast API (placeholder for actual implementation)
    console.log('Initializing Cast API');
  }, []);

  const connect = useCallback(async (deviceId?: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const device = devices.find(d => d.id === deviceId) || devices[0];
      if (device) {
        setCurrentDevice(device);
        setIsConnected(true);
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, status: 'connected' } : d
        ));
      }
    } catch (error) {
      console.error('Failed to connect to cast device:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [devices]);

  const disconnect = useCallback(async () => {
    try {
      setIsConnected(false);
      setCurrentDevice(null);
      setDevices(prev => prev.map(d => ({ ...d, status: 'available' })));
    } catch (error) {
      console.error('Failed to disconnect from cast device:', error);
    }
  }, []);

  const castTrack = useCallback(async (track: any) => {
    if (!isConnected || !currentDevice) {
      throw new Error('No cast device connected');
    }

    try {
      // Simulate casting track
      console.log('Casting track to', currentDevice.name, ':', track.title);
      // In real implementation, this would send the track to the cast device
    } catch (error) {
      console.error('Failed to cast track:', error);
      throw error;
    }
  }, [isConnected, currentDevice]);

  return {
    isAvailable,
    isConnected,
    isConnecting,
    devices,
    currentDevice,
    connect,
    disconnect,
    castTrack,
  };
};

// Extend window type for Chrome Cast API
declare global {
  interface Window {
    chrome: {
      cast: any;
    };
  }
}