# Sri Guru Dig Vandanam - Native Mobile Apps

## React Native Implementation

I've created a complete React Native application that provides native Android and iOS versions of your spiritual guidance app.

### Key Features Implemented

**Core Functionality:**
- GPS location tracking with permissions
- Device magnetometer for compass functionality  
- Real-time bearing calculations to Guru location
- Haptic feedback when aligned with direction
- Immersive darshan experience with native animations
- Audio controls for spiritual content
- Push notifications for location updates

**Native Mobile Optimizations:**
- Bottom tab navigation optimized for mobile
- Touch-friendly UI with gradient backgrounds
- Native status bar handling
- Smooth animations using Animated API
- Responsive design for different screen sizes
- Device orientation and permission handling

### Project Structure

```
mobile/
├── src/
│   ├── App.tsx                 # Main navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Main compass interface
│   │   ├── DarshanScreen.tsx   # Immersive spiritual experience
│   │   └── AdminScreen.tsx     # Location update interface
│   ├── components/
│   │   └── CompassView.tsx     # Native compass component
│   ├── hooks/
│   │   ├── useLocation.ts      # GPS location hook
│   │   └── useCompass.ts       # Magnetometer hook
│   ├── services/
│   │   └── ApiService.ts       # Backend integration
│   └── utils/
│       └── compass.ts          # Bearing calculations
├── package.json                # Dependencies and scripts
└── metro.config.js             # Metro bundler config
```

### Setup Instructions

1. **Install React Native CLI:**
```bash
npm install -g react-native-cli
```

2. **Navigate to mobile directory:**
```bash
cd mobile
```

3. **Install dependencies:**
```bash
npm install
```

4. **For iOS (macOS only):**
```bash
cd ios && pod install && cd ..
```

5. **Run on device/simulator:**
```bash
# Android
npm run android

# iOS  
npm run ios
```

### Backend Integration

The mobile apps connect to your existing Express.js backend:
- Same WebSocket connection for real-time updates
- Same REST API endpoints for data
- Same admin authentication system
- Same database schema

### App Store Deployment

**Android (Google Play):**
1. Generate signed APK: `npm run build:android`
2. Upload to Google Play Console
3. Configure app listing and screenshots

**iOS (App Store):**
1. Archive in Xcode: `npm run build:ios`
2. Upload to App Store Connect via Xcode
3. Submit for review

### Permissions Required

**Android (android/app/src/main/AndroidManifest.xml):**
- `ACCESS_FINE_LOCATION` - GPS tracking
- `ACCESS_COARSE_LOCATION` - Network location
- `VIBRATE` - Haptic feedback
- `INTERNET` - API communication

**iOS (ios/Info.plist):**
- `NSLocationWhenInUseUsageDescription` - Location access
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Background location

### Device Compatibility

**Minimum Requirements:**
- Android 7.0+ (API level 24)
- iOS 12.0+
- Magnetometer sensor for compass
- GPS capability for location

The React Native implementation provides true native performance while sharing code between platforms. Users get the full mobile experience with device-specific optimizations.