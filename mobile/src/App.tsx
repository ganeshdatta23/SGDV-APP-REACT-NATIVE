import React, {useEffect} from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import DarshanScreen from './screens/DarshanScreen';

// Services
import {initializePushNotifications} from './services/NotificationService';
import {requestLocationPermission} from './services/LocationService';

// Icons
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Compass') {
            iconName = 'explore';
          } else if (route.name === 'Admin') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Compass" component={HomeScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  );
}

function App(): JSX.Element {
  useEffect(() => {
    const initializeApp = async () => {
      // Request location permissions
      await requestLocationPermission();
      
      // Initialize push notifications
      await initializePushNotifications();
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="Darshan" 
          component={DarshanScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;