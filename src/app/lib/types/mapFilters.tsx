import { Dayjs } from "dayjs";

export type TransportType = "car" | "other" | null;

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
  selectedTransport: TransportType;
  selectedDate: Dayjs | null;
  actions: MapFiltersActions;
}
