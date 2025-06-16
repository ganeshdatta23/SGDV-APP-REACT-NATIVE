import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {triggerHapticFeedback} from '../services/HapticService';

interface DarshanScreenProps {
  route: {
    params: {
      isAligned: boolean;
    };
  };
}

const {width, height} = Dimensions.get('window');

const DarshanScreen: React.FC<DarshanScreenProps> = ({route}) => {
  const navigation = useNavigation();
  const {isAligned} = route.params;
  
  const glowAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide status bar for immersive experience
    StatusBar.setHidden(true);
    
    // Trigger haptic feedback on enter
    triggerHapticFeedback('impactHeavy');
    
    // Start animations
    startGlowAnimation();
    startFloatingAnimations();
    
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startFloatingAnimations = () => {
    const createFloatAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createFloatAnimation(floatAnim1, 0),
      createFloatAnimation(floatAnim2, 1000),
      createFloatAnimation(floatAnim3, 2000),
    ]).start();
  };

  const handleClose = () => {
    triggerHapticFeedback('impactLight');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}>
        
        {/* Sacred background pattern */}
        <View style={styles.backgroundPattern} />

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <View style={styles.closeButtonBackground}>
            <Icon name="close" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* Main content */}
        <View style={styles.content}>
          
          {/* Guru image with glow effect */}
          <Animated.View 
            style={[
              styles.guruImageContainer,
              {
                transform: [{scale: glowAnim}],
              },
            ]}>
            <LinearGradient
              colors={['#FF6B35', '#D4A574']}
              style={styles.guruImageGradient}>
              <View style={styles.guruImageInner}>
                <Text style={styles.omSymbolLarge}>🕉</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Sacred texts */}
          <View style={styles.textContainer}>
            <Text style={styles.sanskritTitle}>श्री गुरु दिग्वन्दनम्</Text>
            
            <Text style={styles.sanskritVerse}>
              गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।{'\n'}
              गुरुरेव परं ब्रह्म तस्मै श्रीगुरवे नमः॥
            </Text>
            
            <Text style={styles.englishTranslation}>
              "The Guru is Brahma, the Guru is Vishnu, the Guru is Maheshwara.{'\n'}
              The Guru is indeed the Supreme Brahman. Salutations to that Guru."
            </Text>
          </View>

          {/* Alignment status */}
          <View style={styles.alignmentContainer}>
            <LinearGradient
              colors={['rgba(78, 237, 196, 0.2)', 'rgba(78, 237, 196, 0.1)']}
              style={styles.alignmentBox}>
              <View style={styles.alignmentContent}>
                <View style={[
                  styles.alignmentIndicator,
                  {backgroundColor: isAligned ? '#4ECDC4' : 'rgba(255,255,255,0.5)'}
                ]} />
                <Text style={styles.alignmentText}>
                  {isAligned ? 'Perfectly Aligned' : 'Seeking Alignment'}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Spiritual message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>In this sacred moment of alignment,</Text>
            <Text style={styles.messageText}>Feel the divine presence and guidance.</Text>
            <Text style={styles.peaceSalutation}>ॐ शान्ति शान्ति शान्ति:</Text>
          </View>
        </View>

        {/* Floating spiritual elements */}
        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement1,
            {
              transform: [{
                translateY: floatAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              }],
              opacity: floatAnim1.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.6, 1, 0.6],
              }),
            },
          ]}>
          <Text style={styles.floatingSymbol}>✨</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement2,
            {
              transform: [{
                translateY: floatAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              }],
              opacity: floatAnim2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.6, 1, 0.6],
              }),
            },
          ]}>
          <Text style={styles.floatingSymbol}>🌸</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement3,
            {
              transform: [{
                translateY: floatAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -25],
                }),
              }],
              opacity: floatAnim3.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.6, 1, 0.6],
              }),
            },
          ]}>
          <Text style={styles.floatingSymbol}>🪷</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    // Pattern would be implemented with react-native-svg
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButtonBackground: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  guruImageContainer: {
    marginBottom: 40,
  },
  guruImageGradient: {
    width: 192,
    height: 192,
    borderRadius: 96,
    padding: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  guruImageInner: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  omSymbolLarge: {
    fontSize: 72,
    color: '#FF6B35',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sanskritTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  sanskritVerse: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
    fontFamily: 'serif',
  },
  englishTranslation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  alignmentContainer: {
    marginBottom: 32,
  },
  alignmentBox: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  alignmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  alignmentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  alignmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 4,
  },
  peaceSalutation: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingElement1: {
    top: height * 0.2,
    left: width * 0.1,
  },
  floatingElement2: {
    bottom: height * 0.25,
    right: width * 0.15,
  },
  floatingElement3: {
    top: height * 0.3,
    right: width * 0.2,
  },
  floatingSymbol: {
    fontSize: 24,
  },
});

export default DarshanScreen;