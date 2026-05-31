/**
 * Track store — remembers which learning path the user selected.
 *
 * The selected track id is the one piece of state downstream screens (home,
 * lessons) read to know what curriculum to show, so it is persisted to
 * AsyncStorage and rehydrated on launch (see AGENTS.md → store/ + State Rules).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getTrackById } from "@/data/tracks";
import type { Track } from "@/types/learning";

interface TrackState {
  /** Id of the selected track, or null before the user picks one. */
  selectedTrackId: string | null;
  /** True once AsyncStorage has finished rehydrating this store. */
  hasHydrated: boolean;
  selectTrack: (id: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useTrackStore = create<TrackState>()(
  persist(
    (set) => ({
      selectedTrackId: null,
      hasHydrated: false,
      selectTrack: (id) => set({ selectedTrackId: id }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "track-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the selection — hydration flag is runtime-only.
      partialize: (state) => ({ selectedTrackId: state.selectedTrackId }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

/** Convenience hook: resolves the selected id to its full Track object. */
export const useSelectedTrack = (): Track | undefined => {
  const selectedTrackId = useTrackStore((state) => state.selectedTrackId);
  return selectedTrackId ? getTrackById(selectedTrackId) : undefined;
};
