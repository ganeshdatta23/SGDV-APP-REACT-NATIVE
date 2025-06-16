import { useState, useEffect } from "react";
import { CompassView } from "@/components/CompassView";
import { DarshanModal } from "@/components/DarshanModal";
import { AudioControls } from "@/components/AudioControls";
import { PermissionModal } from "@/components/PermissionModal";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGuruLocation } from "@/hooks/useGuruLocation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { calculateBearing, calculateDistance, getBearingDirection } from "@/lib/compass";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Compass, Settings, Bell, Eye, Navigation, RotateCw, Map, History, User } from "lucide-react";

export default function Home() {
  const [isDarshanMode, setIsDarshanMode] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const { toast } = useToast();
  const { heading, hasPermission, requestPermission } = useDeviceOrientation();
  const { location: userLocation, error: locationError } = useGeolocation();
  const { location: guruLocation, isLoading: isLoadingLocation } = useGuruLocation();
  
  useWebSocket('/ws', {
    onMessage: (data) => {
      if (data.type === 'location_update') {
        toast({
          title: "Location Updated",
          description: `Guru's location has been updated`,
        });
        setConnectionStatus("Connected • Last Updated: Just now");
      }
    },
    onConnect: () => setConnectionStatus("Connected"),
    onDisconnect: () => setConnectionStatus("Disconnected"),
  });

  const bearing = userLocation && guruLocation ? 
    calculateBearing(
      parseFloat(userLocation.latitude.toString()),
      parseFloat(userLocation.longitude.toString()),
      parseFloat(guruLocation.latitude),
      parseFloat(guruLocation.longitude)
    ) : 0;

  const distance = userLocation && guruLocation ?
    calculateDistance(
      parseFloat(userLocation.latitude.toString()),
      parseFloat(userLocation.longitude.toString()),
      parseFloat(guruLocation.latitude),
      parseFloat(guruLocation.longitude)
    ) : 0;

  const relativeBearing = (bearing - heading + 360) % 360;
  const ALIGNMENT_THRESHOLD = 15;

  useEffect(() => {
    const aligned = Math.abs(relativeBearing) <= ALIGNMENT_THRESHOLD || 
                   Math.abs(relativeBearing - 360) <= ALIGNMENT_THRESHOLD;
    
    if (aligned !== isAligned) {
      setIsAligned(aligned);
      
      if (aligned && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  }, [relativeBearing, isAligned]);

  useEffect(() => {
    if (!hasPermission) {
      setShowPermissionModal(true);
    }
  }, [hasPermission]);

  useEffect(() => {
    setConnectionStatus(`Connected • Last Updated: ${new Date().toLocaleTimeString()}`);
  }, [guruLocation]);

  const handleRequestPermissions = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionModal(false);
      toast({
        title: "Permissions Granted",
        description: "Compass is now active",
      });
    }
  };

  const handleEnterDarshan = () => {
    if (isAligned) {
      setIsDarshanMode(true);
    } else {
      toast({
        title: "Alignment Required",
        description: "Please align your device with the Guru direction first",
      });
    }
  };

  const handleGetDirections = () => {
    if (userLocation && guruLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${guruLocation.latitude},${guruLocation.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleCalibrateCompass = () => {
    toast({
      title: "Calibrating...",
      description: "Move your device in a figure-8 pattern",
    });
  };

  if (locationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-white via-soft-gray to-meditation/10 p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Location Access Required</h2>
          <p className="text-gray-600 mb-4">
            This app needs location access to provide direction guidance to your Guru.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-meditation/10 overflow-x-hidden">
      {/* Status Bar */}
      <div className="bg-spiritual text-white p-1 text-center text-xs font-medium">
        <Bell className="inline w-3 h-3 mr-1" />
        <span>{connectionStatus}</span>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-saffron to-sacred p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-sacred font-semibold text-lg">Sri Guru Dig Vandanam</h1>
              <p className="text-white/80 text-sm">
                {isLoadingLocation ? "Loading..." : guruLocation ? 
                  `${guruLocation.city}, ${guruLocation.state}` : "No location"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/admin">
              <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur rounded-full p-0">
                <Settings className="text-white w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur rounded-full p-0">
              <Bell className="text-white w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Distance & Status */}
        <div className="mt-4 flex justify-between items-center">
          <div className="bg-white/15 backdrop-blur rounded-lg px-4 py-2">
            <span className="text-white/70 text-xs">Distance</span>
            <div className="text-white font-semibold">{distance.toFixed(1)} km</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-lg px-4 py-2">
            <span className="text-white/70 text-xs">Bearing</span>
            <div className="text-white font-semibold">{bearing.toFixed(0)}° {getBearingDirection(bearing)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-lg px-4 py-2">
            <span className="text-white/70 text-xs">Alignment</span>
            <div className="text-white font-semibold">
              <div className={`inline-block w-2 h-2 rounded-full mr-1 ${isAligned ? 'bg-divine' : 'bg-white/50'}`}></div>
              {isAligned ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Compass Section */}
        <CompassView 
          heading={heading}
          bearing={bearing}
          isAligned={isAligned}
          hasPermission={hasPermission}
        />

        {/* Audio Controls */}
        <AudioControls />

        {/* Action Buttons */}
        <div className="bg-soft-gray p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleEnterDarshan}
              className="bg-gradient-to-br from-saffron to-sacred p-4 h-auto rounded-xl shadow-lg text-white font-semibold transform transition-transform active:scale-95 hover:from-saffron/90 hover:to-sacred/90"
            >
              <div className="flex flex-col items-center">
                <Eye className="w-6 h-6 mb-2" />
                Darshan View
                <p className="text-xs text-white/80 mt-1">Immersive experience</p>
              </div>
            </Button>
            
            <Button
              onClick={handleGetDirections}
              className="bg-gradient-to-br from-divine to-meditation p-4 h-auto rounded-xl shadow-lg text-white font-semibold transform transition-transform active:scale-95 hover:from-divine/90 hover:to-meditation/90"
            >
              <div className="flex flex-col items-center">
                <Navigation className="w-6 h-6 mb-2" />
                Directions
                <p className="text-xs text-white/80 mt-1">Navigate to location</p>
              </div>
            </Button>
          </div>
          
          <Button
            onClick={handleCalibrateCompass}
            variant="outline"
            className="w-full mt-4 bg-white border-2 border-spiritual/20 p-4 rounded-xl font-semibold text-spiritual transform transition-transform active:scale-95"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Calibrate Compass
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-saffron">
            <Compass className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Compass</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-gray-400">
            <Map className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Map</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-gray-400">
            <History className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">History</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-gray-400">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </nav>

      {/* Modals */}
      <DarshanModal 
        isOpen={isDarshanMode} 
        onClose={() => setIsDarshanMode(false)}
        isAligned={isAligned}
      />
      
      <PermissionModal 
        isOpen={showPermissionModal}
        onRequestPermissions={handleRequestPermissions}
        onClose={() => setShowPermissionModal(false)}
      />
    </div>
  );
}
