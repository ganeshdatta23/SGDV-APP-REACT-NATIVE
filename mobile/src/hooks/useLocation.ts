import {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs location access to provide direction guidance.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError({
              code: 1,
              message: 'Location permission denied',
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          setError({
            code: -1,
            message: 'Failed to request location permission',
          });
          setIsLoading(false);
          return;
        }
      }

      // Configure location options
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Use cached position if less than 1 minute old
      };

      const handleSuccess = (position: any) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
        setIsLoading(false);
      };

      const handleError = (error: any) => {
        let errorMessage = 'Unknown location error';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied by user';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out';
            break;
        }

        setError({
          code: error.code,
          message: errorMessage,
        });
        setIsLoading(false);
      };

      // Get initial position
      Geolocation.getCurrentPosition(handleSuccess, handleError, options);

      // Watch for position changes
      const watchId = Geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );

      // Cleanup function
      return () => {
        if (watchId) {
          Geolocation.clearWatch(watchId);
        }
      };
    };

    requestLocationPermission();
  }, []);

  return {location, error, isLoading};
};