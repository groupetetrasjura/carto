import { StateCreator, create } from "zustand";
import dayjs, { Dayjs } from "dayjs";
import {
  MapBackground,
  MapFiltersState,
  MaptilerMapIds,
  TransportType,
  Zone,
} from "@/app/lib/types/mapFilters";

export const initialMapFiltersState = {
  selectedZones: [],
  selectedTransport: TransportType.OUTDOOR,
  selectedDate: dayjs(),
  currentStep: 0,
  showMultiStepForm: false,
  maptilerMapId: null,
  maptilerMapIds: null,
  activeMapBackground: MapBackground.DYNAMIC,
};

export const stateCreator: StateCreator<MapFiltersState> = (set) => ({
  ...initialMapFiltersState,
  actions: {
    setSelectedZones: (zone: Zone) =>
      set((state) => {
        const isZoneSelected = state.selectedZones.includes(zone);
        return {
          selectedZones: isZoneSelected
            ? state.selectedZones.filter((z) => z !== zone)
            : [...state.selectedZones, zone],
        };
      }),
    setSelectedTransport: (transport: TransportType) =>
      set(() => {
        // let activeMapBackground = null;
        switch (transport) {
          case TransportType.CAR:
            // activeMapBackground = MapBackground.STREETS;
            break;
          case TransportType.OUTDOOR:
            // activeMapBackground = MapBackground.OUTDOOR;
            break;
        }
        return {
          selectedTransport: transport,
          // activeMapBackground,
        };
      }),
    setSelectedDate: (date: Dayjs | null) => set({ selectedDate: date }),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    setShowMultiStepForm: (value: boolean) => set({ showMultiStepForm: value }),
    setMaptilerMapId: (mapId: string) => set({ maptilerMapId: mapId }),
    setMaptilerMapIds: (mapIds: MaptilerMapIds) =>
      set({ maptilerMapIds: mapIds }),
    setActiveMapBackground: (background: MapBackground) =>
      set({ activeMapBackground: background }),
    clearMapFilters: () => set(initialMapFiltersState),
  },
});

export const useMapFilters = create<MapFiltersState>()(stateCreator);

// GETTERS
export const useMapFiltersSelectedZones = () =>
  useMapFilters((state) => state.selectedZones);

export const useMapFiltersSelectedTransport = () =>
  useMapFilters((state) => state.selectedTransport);

export const useActiveMapBackground = () =>
  useMapFilters((state) => state.activeMapBackground);
export const useMaptilerMapId = () =>
  useMapFilters((state) => {
    // First check activeMapBackground
    if (state.activeMapBackground) {
      switch (state.activeMapBackground) {
        case MapBackground.STREETS:
          return state.maptilerMapIds?.streets || "streets-v2";
        case MapBackground.OUTDOOR:
          return state.maptilerMapIds?.outdoor || "outdoor-v2";
        case MapBackground.LANDSCAPE || MapBackground.DYNAMIC:
          return state.maptilerMapIds?.landscape || "landscape";
        case MapBackground.IGN:
          return null;
      }
    }

    // If no activeMapBackground, fallback to transport type
    switch (state.selectedTransport) {
      case TransportType.CAR:
        return state.maptilerMapIds?.landscape || "landscape";
      case TransportType.OUTDOOR:
        return state.maptilerMapIds?.landscape || "landscape";
      default:
        return state.maptilerMapIds?.landscape || "landscape";
    }
  });

export const useMapFiltersSelectedDate = () =>
  useMapFilters((state) => state.selectedDate);

export const useMapFiltersActions = () =>
  useMapFilters((state) => state.actions);

export const useMapFiltersCurrentStep = () =>
  useMapFilters((state) => state.currentStep);

export const useMapFiltersShowMultiStepForm = () =>
  useMapFilters((state) => state.showMultiStepForm);
