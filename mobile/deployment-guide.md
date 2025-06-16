# Native Mobile App Deployment Guide

## Complete React Native Setup for Android & iOS

### Prerequisites
1. **Development Environment:**
   - Node.js 18+
   - React Native CLI
   - Android Studio (for Android development)
   - Xcode (for iOS development, macOS only)

2. **Device Requirements:**
   - Android 7.0+ with magnetometer sensor
   - iOS 12.0+ with location services

### Quick Start Commands

```bash
# Initialize React Native project
npx react-native init SriGuruDigVandanam

# Navigate to project
cd SriGuruDigVandanam

# Copy the mobile source files to this new project
# Replace the default files with our custom implementation

# Install dependencies
npm install

# For iOS setup (macOS only)
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

### Production Build Process

**Android APK Generation:**
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

**iOS Archive (Xcode required):**
```bash
# Open project in Xcode
open ios/SriGuruDigVandanam.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device" as target
# 2. Product → Archive
# 3. Distribute App → App Store Connect
```

### App Store Submission

**Google Play Store:**
1. Create developer account ($25 one-time fee)
2. Upload APK to Play Console
3. Configure app details, screenshots, descriptions
4. Submit for review (typically 1-3 days)

**Apple App Store:**
1. Create Apple Developer account ($99/year)
2. Upload archive via Xcode or Application Loader
3. Configure app metadata in App Store Connect
4. Submit for review (typically 1-7 days)

### Key Mobile Features

1. **Native Compass Integration**
   - Device magnetometer for accurate heading
   - Smooth animations and real-time updates
   - Haptic feedback for alignment confirmation

2. **GPS Location Services**
   - High-accuracy positioning
   - Background location updates
   - Permission management for both platforms

3. **Immersive Darshan Experience**
   - Full-screen modal with native animations
   - Sacred text display with proper typography
   - Spiritual visual effects and transitions

4. **Push Notifications**
   - Real-time Guru location updates
   - Background sync capabilities
   - Platform-specific notification handling

5. **Audio Integration**
   - Background music playback
   - Spiritual chant audio support
   - Native audio controls and interruption handling

### Backend Integration

The mobile apps connect to your existing web application backend:
- WebSocket connection for real-time updates
- REST API for location data and admin functions
- Same authentication and database system
- Cross-platform compatibility maintained

### Performance Optimizations

1. **Native Animations**
   - Hardware-accelerated transforms
   - Smooth 60fps compass rotation
   - Gesture-responsive interactions

2. **Memory Management**
   - Efficient location caching
   - Audio resource optimization
   - Background task management

3. **Battery Optimization**
   - Intelligent location update intervals
   - Sleep mode handling
   - Network request optimization

### Testing Strategy

1. **Device Testing**
   - Test on various Android devices and versions
   - Test on different iPhone models and iOS versions
   - Verify compass accuracy across devices

2. **Permission Testing**
   - Location permission flows
   - Compass/magnetometer access
   - Push notification permissions

3. **Network Testing**
   - Offline mode functionality
   - Poor connection handling
   - WebSocket reconnection logic

The React Native implementation provides true native performance while maintaining code sharing between platforms. Users get platform-specific optimizations and the full mobile experience they expect from a dedicated app.