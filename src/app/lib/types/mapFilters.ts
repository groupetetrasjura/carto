import { Dayjs } from "dayjs";

export enum TransportType {
  CAR = "car",
  OTHER = "other",
}

export type Zone =
  | "Massacre"
  | "Bois de Ban-Arobiers"
  | "Risoux"
  | "Haute Joux"
  | "Combe Noire";

export interface MapFiltersActions {
  setSelectedZones: (zone: Zone) => void;
  setSelectedTransport: (transport: TransportType) => void;
  setSelectedDate: (date: Dayjs | null) => void;
}
export interface MapFiltersState {
  selectedZones: Zone[];
  selectedTransport: TransportType | null;
  selectedDate: Dayjs | null;
  actions: MapFiltersActions;
}
