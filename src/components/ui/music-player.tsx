'use client';

import type { ReactElement } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Self-hosted Christmas jingle bells melody
const CHRISTMAS_MUSIC_URL = '/christmas-music.mp3';

export function MusicPlayer(): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(CHRISTMAS_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3; // 30% volume - not too loud
    audio.preload = 'auto';

    const handleLoaded = () => {
      setIsLoaded(true);
    };

    // Multiple events for cross-browser compatibility
    audio.addEventListener('canplaythrough', handleLoaded);
    audio.addEventListener('canplay', handleLoaded);
    audio.addEventListener('loadeddata', handleLoaded);

    // Handle errors
    audio.addEventListener('error', (e) => {
      console.error('Audio failed to load:', e);
      // Still enable button so user can try
      setIsLoaded(true);
    });

    audioRef.current = audio;

    // Force load
    audio.load();

    // Hide tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('canplaythrough', handleLoaded);
      audio.removeEventListener('canplay', handleLoaded);
      audio.removeEventListener('loadeddata', handleLoaded);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Failed to play audio:', err);
        // Try reloading and playing again
        audioRef.current.load();
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (retryErr) {
          console.error('Retry also failed:', retryErr);
        }
      }
    }
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute bottom-full left-0 mb-2 whitespace-nowrap"
          >
            <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-700 border border-gray-200">
              <span className="mr-1">🎵</span>
              Click for holiday music!
              <div className="absolute top-full left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music toggle button */}
      <motion.button
        onClick={toggleMusic}
        disabled={!isLoaded}
        className={`
          relative w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300
          ${isPlaying 
            ? 'bg-gradient-to-br from-red-500 to-green-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
          }
          ${!isLoaded ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          border-2 ${isPlaying ? 'border-white/30' : 'border-gray-200'}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Mute holiday music' : 'Play holiday music'}
      >
        {/* Animated music notes when playing */}
        {isPlaying && (
          <>
            <motion.span
              className="absolute -top-1 -right-1 text-lg"
              animate={{ 
                y: [-5, -15, -5],
                opacity: [1, 0.5, 1],
                rotate: [-10, 10, -10]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎵
            </motion.span>
            <motion.span
              className="absolute -top-2 left-0 text-sm"
              animate={{ 
                y: [-3, -12, -3],
                opacity: [0.8, 0.3, 0.8],
                rotate: [10, -10, 10]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              🎶
            </motion.span>
          </>
        )}

        {isPlaying ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}

        {/* Pulsing ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}
