import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CompassViewProps {
  heading: number;
  bearing: number;
  isAligned: boolean;
  hasPermission: boolean;
  onRequestPermission: () => void;
}

const {width} = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8;

const CompassView: React.FC<CompassViewProps> = ({
  heading,
  bearing,
  isAligned,
  hasPermission,
  onRequestPermission,
}) => {
  const compassRotation = useRef(new Animated.Value(0)).current;
  const guruRotation = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Animate compass rotation
  useEffect(() => {
    Animated.timing(compassRotation, {
      toValue: -heading,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [heading, compassRotation]);

  // Animate guru indicator rotation
  useEffect(() => {
    Animated.timing(guruRotation, {
      toValue: bearing,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [bearing, guruRotation]);

  // Alignment glow animation
  useEffect(() => {
    if (isAligned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(1);
    }
  }, [isAligned, glowAnim]);

  return (
    <View style={styles.container}>
      {/* Background pattern */}
      <View style={styles.backgroundPattern} />
      
      {/* Compass container */}
      <View style={styles.compassContainer}>
        
        {/* Outer ring */}
        <View style={styles.outerRing}>
          
          {/* Compass background */}
          <LinearGradient
            colors={['#FFFFFF', '#F8F7F5']}
            style={styles.compassBackground}>
            
            {/* Compass rose with direction markers */}
            <Animated.View 
              style={[
                styles.compassRose,
                {
                  transform: [{
                    rotate: compassRotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  }],
                },
              ]}>
              
              {/* Cardinal directions */}
              <Text style={[styles.directionText, styles.northText]}>N</Text>
              <Text style={[styles.directionText, styles.eastText]}>E</Text>
              <Text style={[styles.directionText, styles.southText]}>S</Text>
              <Text style={[styles.directionText, styles.westText]}>W</Text>
              
              {/* Degree markings */}
              {Array.from({length: 36}, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.degreeMark,
                    {
                      transform: [
                        {rotate: `${i * 10}deg`},
                        {translateY: -COMPASS_SIZE / 2 + 20},
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            
            {/* Guru direction indicator */}
            <Animated.View 
              style={[
                styles.guruIndicator,
                {
                  transform: [{
                    rotate: guruRotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  }, {
                    scale: glowAnim,
                  }],
                },
              ]}>
              <LinearGradient
                colors={isAligned ? ['#FF6B35', '#D4A574'] : ['#FF6B35', '#D4A574']}
                style={styles.guruArrow}>
                <Text style={styles.omSymbol}>🕉</Text>
              </LinearGradient>
            </Animated.View>
            
            {/* Center circle */}
            <LinearGradient
              colors={['#FF6B35', '#D4A574']}
              style={styles.centerCircle}>
              <Icon name="my-location" size={24} color="white" />
            </LinearGradient>
            
            {/* Alignment ring */}
            <View style={[
              styles.alignmentRing,
              {
                borderColor: isAligned ? '#4ECDC4' : 'rgba(76, 237, 196, 0.2)',
                shadowColor: isAligned ? '#4ECDC4' : 'transparent',
              },
            ]} />
          </LinearGradient>
        </View>
      </View>
      
      {/* Heading display */}
      <View style={styles.headingDisplay}>
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(248,247,245,0.9)']}
          style={styles.headingContainer}>
          <Text style={styles.headingValue}>{Math.round(heading)}°</Text>
          <Text style={styles.headingLabel}>Current Heading</Text>
        </LinearGradient>
      </View>
      
      {/* Permission hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          {!hasPermission 
            ? "Grant compass permissions for accurate direction" 
            : "Move device in figure-8 pattern to calibrate"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFDF8',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(107, 70, 193, 0.05)',
    // Pattern would be implemented with a library like react-native-svg
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    position: 'relative',
  },
  outerRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 4,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    padding: 8,
  },
  compassBackground: {
    flex: 1,
    borderRadius: (COMPASS_SIZE - 16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  compassRose: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  northText: {
    top: 12,
  },
  eastText: {
    right: 12,
  },
  southText: {
    bottom: 12,
  },
  westText: {
    left: 12,
  },
  degreeMark: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: 'rgba(107, 70, 193, 0.3)',
    top: '50%',
    left: '50%',
    marginLeft: -1,
    marginTop: -8,
  },
  guruIndicator: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -12,
  },
  guruArrow: {
    width: 24,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  omSymbol: {
    fontSize: 16,
    color: 'white',
  },
  centerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  alignmentRing: {
    position: 'absolute',
    width: COMPASS_SIZE - 48,
    height: COMPASS_SIZE - 48,
    borderRadius: (COMPASS_SIZE - 48) / 2,
    borderWidth: 2,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  headingDisplay: {
    position: 'absolute',
    top: -80,
    left: '50%',
    marginLeft: -60,
  },
  headingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B46C1',
    textAlign: 'center',
  },
  headingLabel: {
    fontSize: 12,
    color: 'rgba(107, 70, 193, 0.7)',
    textAlign: 'center',
  },
  hintContainer: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    marginLeft: -100,
    width: 200,
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(107, 70, 193, 0.7)',
    textAlign: 'center',
  },
});

export default CompassView;