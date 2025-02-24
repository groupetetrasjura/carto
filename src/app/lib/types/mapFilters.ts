import { Dayjs } from "dayjs";

export enum TransportType {
  CAR = "car",
  OUTDOOR = "outdoor",
}

export type Zone =
  | "Massacre"
  | "Bois de Bans-Arobiers"
  | "Risoux"
  | "Haute Joux"
  | "Combe Noire";

export enum MapBackground {
  OUTDOOR = "outdoor-v2",
  STREETS = "streets-v2",
  IGN = "ign-layer",
  LANDSCAPE = "landscape",
}

export interface MapFiltersActions {
  setSelectedZones: (zone: Zone) => void;
  setSelectedTransport: (transport: TransportType) => void;
  setSelectedDate: (date: Dayjs | null) => void;
  setCurrentStep: (step: number) => void;
  setShowMultiStepForm: (value: boolean) => void;
  setMaptilerMapId: (mapId: string) => void;
  setActiveMapBackground: (background: MapBackground) => void;
  clearMapFilters: () => void;
}
export interface MapFiltersState {
  selectedZones: Zone[];
  selectedTransport: TransportType | null;
  selectedDate: Dayjs | null;
  currentStep: number;
  actions: MapFiltersActions;
  showMultiStepForm: boolean;
  maptilerMapId: string | null;
  activeMapBackground: MapBackground | null;
}
