// ============================================
// Handbook Audio Component
// Exclusive playback wrapper using Global Store
// ============================================

import { useAudioStore } from '@/stores/audioStore';
import { useEffect, useRef } from 'react';

interface HandbookAudioProps extends React.AudioHTMLAttributes<HTMLAudioElement> {
  id: string; // Unique ID required for exclusive control
}

export function HandbookAudio({ id, autoPlay, ...props }: HandbookAudioProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const currentAudioId = useAudioStore((state) => state.currentAudioId);
  const playAudio = useAudioStore((state) => state.playAudio);
  const stopAudio = useAudioStore((state) => state.stopAudio);

  // Exclusive Playback Effect
  useEffect(() => {
    // If another audio is playing, pause this one
    if (currentAudioId && currentAudioId !== id && !ref.current?.paused) {
      ref.current?.pause();
    }
  }, [currentAudioId, id]);

  // Handle AutoPlay on mount
  useEffect(() => {
    if (autoPlay) {
      // Small delay to ensure exclusive control wins
      const timer = setTimeout(() => {
        playAudio(id);
        ref.current?.play().catch(() => {
          // Autoplay might be blocked by browser
          console.warn('Autoplay blocked');
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, id, playAudio]);

  return (
    <audio
      ref={ref}
      {...props}
      onPlay={(e) => {
        playAudio(id);
        props.onPlay?.(e);
      }}
      onPause={(e) => {
        // Only stop global state if WE are the one playing
        if (currentAudioId === id) {
          stopAudio(id);
        }
        props.onPause?.(e);
      }}
      onEnded={(e) => {
        if (currentAudioId === id) {
          stopAudio(id);
        }
        props.onEnded?.(e);
      }}
    />
  );
}
