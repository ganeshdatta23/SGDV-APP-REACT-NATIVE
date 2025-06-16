import { useState, useRef, useCallback } from 'react';

// Since we can't include actual audio files, we'll use placeholder URLs
// In a real implementation, these would be actual audio file URLs
const AUDIO_SOURCES = {
  backgroundMusic: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAA', // Silent audio
  sloka: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAA', // Silent audio
  darshan: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAA', // Silent audio
};

export function useAudio() {
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);
  const [isSlokaPlaying, setIsSlokaPlaying] = useState(false);
  const [isDarshanPlaying, setIsDarshanPlaying] = useState(false);
  
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const slokaAudioRef = useRef<HTMLAudioElement | null>(null);
  const darshanAudioRef = useRef<HTMLAudioElement | null>(null);

  const createAudioElement = useCallback((src: string, loop: boolean = true): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.preload = 'auto';
    
    // Handle autoplay restrictions
    audio.addEventListener('canplaythrough', () => {
      audio.volume = 0.7; // Set volume to 70%
    });
    
    return audio;
  }, []);

  const playBackgroundMusic = useCallback(() => {
    try {
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = createAudioElement(AUDIO_SOURCES.backgroundMusic);
      }
      
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.play()
        .then(() => setIsBackgroundPlaying(true))
        .catch(error => {
          console.warn('Background music autoplay blocked:', error);
          // In a real app, you might show a user prompt to enable audio
        });
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }, [createAudioElement]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
      setIsBackgroundPlaying(false);
    }
  }, []);

  const playSlokaAudio = useCallback(() => {
    try {
      if (!slokaAudioRef.current) {
        slokaAudioRef.current = createAudioElement(AUDIO_SOURCES.sloka);
      }
      
      slokaAudioRef.current.currentTime = 0;
      slokaAudioRef.current.play()
        .then(() => setIsSlokaPlaying(true))
        .catch(error => {
          console.warn('Sloka audio autoplay blocked:', error);
        });
    } catch (error) {
      console.error('Error playing sloka audio:', error);
    }
  }, [createAudioElement]);

  const stopSlokaAudio = useCallback(() => {
    if (slokaAudioRef.current) {
      slokaAudioRef.current.pause();
      slokaAudioRef.current.currentTime = 0;
      setIsSlokaPlaying(false);
    }
  }, []);

  const playDarshanAudio = useCallback(() => {
    try {
      if (!darshanAudioRef.current) {
        darshanAudioRef.current = createAudioElement(AUDIO_SOURCES.darshan, false);
      }
      
      darshanAudioRef.current.currentTime = 0;
      darshanAudioRef.current.play()
        .then(() => setIsDarshanPlaying(true))
        .catch(error => {
          console.warn('Darshan audio autoplay blocked:', error);
        });
    } catch (error) {
      console.error('Error playing darshan audio:', error);
    }
  }, [createAudioElement]);

  const stopDarshanAudio = useCallback(() => {
    if (darshanAudioRef.current) {
      darshanAudioRef.current.pause();
      darshanAudioRef.current.currentTime = 0;
      setIsDarshanPlaying(false);
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    stopBackgroundMusic();
    stopSlokaAudio();
    stopDarshanAudio();
  }, [stopBackgroundMusic, stopSlokaAudio, stopDarshanAudio]);

  return {
    // Background Music
    playBackgroundMusic,
    stopBackgroundMusic,
    isBackgroundPlaying,
    
    // Sloka Audio
    playSlokaAudio,
    stopSlokaAudio,
    isSlokaPlaying,
    
    // Darshan Audio
    playDarshanAudio,
    stopDarshanAudio,
    isDarshanPlaying,
    
    // Utility
    stopAllAudio,
  };
}

// Export audio management hook
export default useAudio;
