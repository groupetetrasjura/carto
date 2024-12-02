import { StateCreator, create } from "zustand";
import { Dayjs } from "dayjs";
import { MapFiltersState, TransportType, Zone } from "../types/mapFilters";

export const initialMapFiltersState = {
  selectedZones: [],
  selectedTransport: null,
  selectedDate: null,
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
      set({ selectedTransport: transport }),
    setSelectedDate: (date: Dayjs | null) => set({ selectedDate: date }),
  },
});

export const useMapFilters = create<MapFiltersState>()(stateCreator);

// GETTERS
export const useMapFiltersSelectedZones = () =>
  useMapFilters((state) => state.selectedZones);

export const useMapFiltersSelectedTransport = () =>
  useMapFilters((state) => state.selectedTransport);

export const useMaptilerMapId = () =>
  useMapFilters((state) => {
    switch (state.selectedTransport) {
      case TransportType.CAR:
        return "streets-v2";
        break;
      case TransportType.OTHER:
        // TODO: add this custom maptilter map id to env var
        return process.env.NEXT_PUBLIC_MAPTILER_MAP_ID;
        break;
      default:
        return "landscape";
        break;
    }
  });

export const useMapFiltersSelectedDate = () =>
  useMapFilters((state) => state.selectedDate);

export const useMapFiltersActions = () =>
  useMapFilters((state) => state.actions);
