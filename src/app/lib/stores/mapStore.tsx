import { StateCreator, create } from "zustand";
import { MapStoreState } from "@/lib/types/MapStore";
import { ViewState } from "react-map-gl";

export const initialMapStoreState = {
  viewState: {
    latitude: 46.543026,
    longitude: 6.019153,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  } as ViewState,
};

export const stateCreator: StateCreator<MapStoreState> = (set) => ({
  ...initialMapStoreState,
  actions: {
    setViewState: (viewState?: ViewState) => {
      set((state) => ({
        ...state,
        viewState,
      }));
    },
  },
});

export const useMapStore = create<MapStoreState>()(stateCreator);

// GETTERS

export const useViewState = () => useMapStore((state) => state.viewState);

// 🎉 one selector for all our actions
export const useMapStoreActions = () => useMapStore((state) => state.actions);
