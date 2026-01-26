import { create } from 'zustand';

interface AudioState {
  currentAudioId: string | null;
  playAudio: (id: string) => void;
  stopAudio: (id?: string) => void;

  // Legacy support & Global UI state
  isContentPlaying: boolean;
  setContentPlaying: (playing: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudioId: null,
  isContentPlaying: false,

  playAudio: (id) => set({ currentAudioId: id, isContentPlaying: true }),

  stopAudio: (id) => {
    // If id is provided, only stop if it matches current (to avoid stopping a new track)
    const { currentAudioId } = get();
    if (!id || id === currentAudioId) {
      set({ currentAudioId: null, isContentPlaying: false });
    }
  },

  setContentPlaying: (playing) => set({ isContentPlaying: playing }),
}));
