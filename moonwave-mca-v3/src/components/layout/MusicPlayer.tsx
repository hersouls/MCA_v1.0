import { useAudioStore } from '@/stores/audioStore';
import { Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  'Decode me slow  (Japanese Ver. Part2).wav',
  'Decode me slow (Chinese Ver.).wav',
  'Decode me slow (Japanese Ver. Part1).wav',
  'Decode me slow (Korean Ver.) (1).wav',
  'Decode me slow (Korean Ver.).wav',
  'Glow Not Noise (1).wav',
  'Glow Not Noise (2).wav',
  'Layback Wave (1).wav',
  'Layback Wave.wav',
  'Light In Me (English Ver. Part1).wav',
  'Light In Me (Korea Ver.).wav',
  'light In Me.wav',
  'Light In Me(Chinese Ver.).wav',
  'Light In Me(Japanese Ver.).wav',
  'Neon Fever (Remastered) (1).wav',
  'Neon Fever (Remastered).wav',
  'Rise so Bright (1).wav',
  'Under the Moonlight (3).wav',
  'Under the Moonlight (2).wav',
  'Under the Moonlight (4).wav',
  'Wabie Sync Part2 (1).wav',
  'Wavecoded Part2 (1).wav',
  'Wavie Sync Part1 (2).wav',
  'Wavie Sync Part1 (1).wav',
].map((name) => `/music/${name}`);

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.2); // Start low as requested
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [_hasInteracted, setHasInteracted] = useState(false);

  const currentAudioId = useAudioStore((state) => state.currentAudioId);
  const playAudio = useAudioStore((state) => state.playAudio);
  const stopAudio = useAudioStore((state) => state.stopAudio);

  // Initialize random track on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TRACKS.length);
    setCurrentTrackIndex(randomIndex);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Exclusive Playback: Pause BGM if another source starts playing
  useEffect(() => {
    if (currentAudioId && currentAudioId !== 'bgm') {
      setIsPlaying(false);
    }
  }, [currentAudioId]);

  // Playback Control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Register as active audio source
        if (currentAudioId !== 'bgm') {
          playAudio('bgm');
        }

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
        // Only release ID if we were the owner
        if (currentAudioId === 'bgm') {
          stopAudio('bgm');
        }
      }
    }
  }, [isPlaying, currentAudioId, playAudio, stopAudio]);

  // Handle track changes (auto-play next)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]); // Only re-run on track change

  // Autoplay removed — player starts paused, user must click to play

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  const nextTrack = () => {
    // Random next track for "Random Play" feature
    // asking for "Random Play" usually means shuffle-like behavior
    // but user specific "random place on reload", and "random play"
    // Let's make 'next' also random to satisfy 'random play' requests generally
    // or sequential? "Random Play" usually implies shuffle order.
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * TRACKS.length);
    } while (nextIndex === currentTrackIndex && TRACKS.length > 1);

    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-full bg-surface-hover border border-border ml-4">
      <audio ref={audioRef} src={TRACKS[currentTrackIndex]} onEnded={handleEnded} />

      <button
        onClick={togglePlay}
        className="p-1.5 rounded-full hover:bg-surface-active transition-colors"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <button
        onClick={nextTrack}
        className="p-1.5 rounded-full hover:bg-surface-active transition-colors"
        aria-label="Next track (Random)"
      >
        <SkipForward size={14} />
      </button>

      <div className="flex items-center gap-1 group relative">
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-surface-active transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Volume slider that appears on hover - keeping it simple for footer */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number.parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-16 h-1 bg-surface-active rounded-lg appearance-none cursor-pointer accent-primary-600"
          aria-label="Volume"
        />
      </div>

      <div className="text-[10px] text-muted-foreground max-w-[100px] truncate select-none">
        {TRACKS[currentTrackIndex].split('/').pop()?.replace('.wav', '')}
      </div>
    </div>
  );
}
