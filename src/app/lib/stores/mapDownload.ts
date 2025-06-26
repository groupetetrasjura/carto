import { StateCreator, create } from "zustand";
import { Dayjs } from "dayjs";

interface MapDownloadState {
  isDownloadPopupOpen: boolean;
  selectedZoneName: string | null;
  selectedPeriod: string | null;
  selectedTransport: string | null;
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  actions: {
    setIsDownloadPopupOpen: (isOpen: boolean) => void;
    openDownloadPopupForSelectedZone: (zoneName: string) => void;
    setSelectedZoneName: (zoneName: string | null) => void;
    setSelectedPeriod: (period: string | null) => void;
    setSelectedTransport: (transport: string | null) => void;
    setDateRange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
    clearDownloadState: () => void;
  };
}

export const initialMapDownloadState = {
  isDownloadPopupOpen: false,
  selectedZoneName: null,
  selectedPeriod: null,
  selectedTransport: null,
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

export const stateCreator: StateCreator<MapDownloadState> = (set) => ({
  ...initialMapDownloadState,
  actions: {
    setIsDownloadPopupOpen: (isOpen: boolean) =>
      set({ isDownloadPopupOpen: isOpen }),
    setSelectedZoneName: (zoneName: string | null) =>
      set({ selectedZoneName: zoneName }),
    setSelectedPeriod: (period: string | null) =>
      set({ selectedPeriod: period }),
    setSelectedTransport: (transport: string | null) =>
      set({ selectedTransport: transport }),
    openDownloadPopupForSelectedZone: (zoneName: string) => {
      set({ selectedZoneName: zoneName });
      set({ isDownloadPopupOpen: true });
    },
    setDateRange: (startDate: Dayjs | null, endDate: Dayjs | null) =>
      set({
        dateRange: {
          startDate,
          endDate,
        },
      }),
    clearDownloadState: () => set(initialMapDownloadState),
  },
});

export const useMapDownload = create<MapDownloadState>()(stateCreator);

// GETTERS
export const useIsDownloadPopupOpen = () =>
  useMapDownload((state) => state.isDownloadPopupOpen);

export const useSelectedZoneName = () =>
  useMapDownload((state) => state.selectedZoneName);

export const useDateRange = () => useMapDownload((state) => state.dateRange);

export const useSelectedPeriod = () =>
  useMapDownload((state) => state.selectedPeriod);

export const useSelectedTransport = () =>
  useMapDownload((state) => state.selectedTransport);

export const useMapDownloadActions = () =>
  useMapDownload((state) => state.actions);
