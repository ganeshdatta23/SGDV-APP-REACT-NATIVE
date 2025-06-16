import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Custom hooks and services
import {useLocation} from '../hooks/useLocation';
import {useCompass} from '../hooks/useCompass';
import {useGuruLocation} from '../hooks/useGuruLocation';
import {useAudioPlayer} from '../hooks/useAudioPlayer';
import {calculateBearing, calculateDistance} from '../utils/compass';
import {triggerHapticFeedback} from '../services/HapticService';

// Components
import CompassView from '../components/CompassView';
import AudioControls from '../components/AudioControls';
import StatusBar from '../components/StatusBar';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isAligned, setIsAligned] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Custom hooks
  const {location: userLocation, error: locationError} = useLocation();
  const {heading, requestPermission, hasPermission} = useCompass();
  const {location: guruLocation, isLoading: isLoadingLocation} = useGuruLocation();
  const {playBackgroundMusic, stopBackgroundMusic, isPlaying} = useAudioPlayer();

  // Calculate bearing and distance to Guru
  const bearing = userLocation && guruLocation ? 
    calculateBearing(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(guruLocation.latitude),
      parseFloat(guruLocation.longitude)
    ) : 0;

  const distance = userLocation && guruLocation ?
    calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(guruLocation.latitude),
      parseFloat(guruLocation.longitude)
    ) : 0;

  const relativeBearing = (bearing - heading + 360) % 360;
  const ALIGNMENT_THRESHOLD = 15;

  // Check alignment
  useEffect(() => {
    const aligned = Math.abs(relativeBearing) <= ALIGNMENT_THRESHOLD || 
                   Math.abs(relativeBearing - 360) <= ALIGNMENT_THRESHOLD;
    
    if (aligned !== isAligned) {
      setIsAligned(aligned);
      
      if (aligned) {
        triggerHapticFeedback('impactMedium');
        
        // Pulse animation for alignment feedback
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [relativeBearing, isAligned, pulseAnim]);

  const handleEnterDarshan = () => {
    if (isAligned) {
      navigation.navigate('Darshan', {isAligned});
    } else {
      Alert.alert(
        'Alignment Required',
        'Please align your device with the Guru direction first',
        [{text: 'OK'}]
      );
    }
  };

  const handleRequestPermissions = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'This app needs compass permissions to provide direction guidance',
        [{text: 'OK'}]
      );
    }
  };

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="location-off" size={64} color="#FF6B35" />
        <Text style={styles.errorTitle}>Location Access Required</Text>
        <Text style={styles.errorText}>
          This app needs location access to provide direction guidance to your Guru.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRequestPermissions}>
          <Text style={styles.retryButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar status={connectionStatus} />
      
      {/* Header */}
      <LinearGradient
        colors={['#FF6B35', '#D4A574']}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Icon name="explore" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Sri Guru Dig Vandanam</Text>
              <Text style={styles.headerSubtitle}>
                {isLoadingLocation ? 'Loading...' : guruLocation ? 
                  `${guruLocation.city}, ${guruLocation.state}` : 'No location'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Status Cards */}
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Distance</Text>
            <Text style={styles.statusValue}>{distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Bearing</Text>
            <Text style={styles.statusValue}>{bearing.toFixed(0)}°</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Alignment</Text>
            <View style={styles.alignmentStatus}>
              <View style={[styles.alignmentDot, {backgroundColor: isAligned ? '#4ECDC4' : 'rgba(255,255,255,0.5)'}]} />
              <Text style={styles.statusValue}>{isAligned ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Compass Section */}
      <View style={styles.compassSection}>
        <CompassView 
          heading={heading}
          bearing={bearing}
          isAligned={isAligned}
          hasPermission={hasPermission}
          onRequestPermission={handleRequestPermissions}
        />
      </View>

      {/* Audio Controls */}
      <AudioControls />

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <View style={styles.actionButtons}>
          <Animated.View style={{transform: [{scale: pulseAnim}]}}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleEnterDarshan}>
              <LinearGradient
                colors={['#FF6B35', '#D4A574']}
                style={styles.buttonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Icon name="visibility" size={24} color="white" />
                <Text style={styles.buttonText}>Darshan View</Text>
                <Text style={styles.buttonSubtext}>Immersive experience</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}>
            <LinearGradient
              colors={['#4ECDC4', '#6B46C1']}
              style={styles.buttonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Icon name="directions" size={24} color="white" />
              <Text style={styles.buttonText}>Directions</Text>
              <Text style={styles.buttonSubtext}>Navigate to location</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.calibrateButton}>
          <Icon name="refresh" size={20} color="#6B46C1" />
          <Text style={styles.calibrateText}>Calibrate Compass</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFDF8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFDF8',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  alignmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  compassSection: {
    flex: 1,
  },
  actionSection: {
    backgroundColor: '#F8F7F5',
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  calibrateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgba(107, 70, 193, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
  },
  calibrateText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
  },
});

export default HomeScreen;