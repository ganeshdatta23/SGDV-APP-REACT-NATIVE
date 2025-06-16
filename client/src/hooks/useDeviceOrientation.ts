import { useState, useEffect, useCallback } from 'react';

export function useDeviceOrientation() {
  const [heading, setHeading] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('DeviceOrientationEvent' in window);
  }, []);

  const handleOrientationChange = useCallback((event: DeviceOrientationEvent) => {
    let compassHeading = 0;
    
    if (event.alpha !== null) {
      // For most browsers
      compassHeading = event.alpha;
    }
    
    // For iOS Safari, use webkitCompassHeading if available
    if ('webkitCompassHeading' in event && (event as any).webkitCompassHeading !== null) {
      compassHeading = (event as any).webkitCompassHeading;
    }
    
    // Normalize to 0-360 degrees
    compassHeading = (360 - compassHeading) % 360;
    
    setHeading(compassHeading);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      // For iOS 13+ devices, we need to request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientationChange);
          setHasPermission(true);
          return true;
        } else {
          return false;
        }
      } else {
        // For other browsers that don't require explicit permission
        window.addEventListener('deviceorientation', handleOrientationChange);
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting device orientation permission:', error);
      return false;
    }
  }, [isSupported, handleOrientationChange]);

  useEffect(() => {
    // Check if permission was already granted
    if (isSupported && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      // Browsers that don't require permission
      window.addEventListener('deviceorientation', handleOrientationChange);
      setHasPermission(true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientationChange);
    };
  }, [isSupported, handleOrientationChange]);

  return {
    heading,
    hasPermission,
    isSupported,
    requestPermission,
  };
}
