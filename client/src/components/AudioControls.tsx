import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAudio } from "@/lib/audio";
import { Music, Heart } from "lucide-react";

export function AudioControls() {
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);
  const [slokaEnabled, setSlokaEnabled] = useState(false);

  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playSlokaAudio,
    stopSlokaAudio,
    isBackgroundPlaying,
    isSlokaPlaying
  } = useAudio();

  const handleBackgroundMusicToggle = (enabled: boolean) => {
    setBackgroundMusicEnabled(enabled);
    if (enabled) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  };

  const handleSlokaToggle = (enabled: boolean) => {
    setSlokaEnabled(enabled);
    if (enabled) {
      playSlokaAudio();
    } else {
      stopSlokaAudio();
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg">
      <h3 className="text-spiritual font-semibold mb-4 flex items-center">
        <Music className="w-5 h-5 mr-2" />
        Spiritual Audio
      </h3>
      
      <div className="space-y-4">
        {/* Background Music */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-spiritual to-meditation rounded-lg flex items-center justify-center">
              <Music className="text-white w-5 h-5" />
            </div>
            <div>
              <Label className="font-medium text-gray-900">Background Music</Label>
              <p className="text-sm text-gray-600">Peaceful meditation sounds</p>
            </div>
          </div>
          <Switch
            checked={backgroundMusicEnabled && isBackgroundPlaying}
            onCheckedChange={handleBackgroundMusicToggle}
            className="data-[state=checked]:bg-spiritual"
          />
        </div>
        
        {/* Sloka Chanting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron to-sacred rounded-lg flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <div>
              <Label className="font-medium text-gray-900">Sloka Chanting</Label>
              <p className="text-sm text-gray-600">Sacred mantras and chants</p>
            </div>
          </div>
          <Switch
            checked={slokaEnabled && isSlokaPlaying}
            onCheckedChange={handleSlokaToggle}
            className="data-[state=checked]:bg-saffron"
          />
        </div>
      </div>
    </div>
  );
}
