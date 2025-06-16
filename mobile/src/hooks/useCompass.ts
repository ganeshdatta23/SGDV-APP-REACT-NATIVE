import {useState, useEffect, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {magnetometer, SensorTypes, setUpdateIntervalForType} from 'react-native-sensors';

export const useCompass = () => {
  const [heading, setHeading] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Set update interval for magnetometer
    setUpdateIntervalForType(SensorTypes.magnetometer, 100); // 100ms
    setIsSupported(true);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          'android.permission.ACCESS_FINE_LOCATION',
          {
            title: 'Compass Permission',
            message: 'This app needs compass access to provide direction guidance.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return false;
        }
      } catch (err) {
        console.warn('Error requesting compass permission:', err);
        return false;
      }
    }

    // Start magnetometer subscription
    const subscription = magnetometer.subscribe(({x, y, z}) => {
      // Calculate heading from magnetometer data
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      
      // Normalize to 0-360 degrees
      angle = (angle + 360) % 360;
      
      setHeading(angle);
    });

    setHasPermission(true);
    
    return true;
  }, []);

  // Auto-request permission for iOS and non-permission required scenarios
  useEffect(() => {
    if (isSupported && Platform.OS === 'ios') {
      requestPermission();
    }
  }, [isSupported, requestPermission]);

  return {
    heading,
    hasPermission,
    isSupported,
    requestPermission,
  };
};