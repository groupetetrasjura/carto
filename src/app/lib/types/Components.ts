export type Zone = {
  fid: number;
  zone: string;
  area: number;
  perimeter: number;
  zoom: number;
  longitude: number;
  latitude: number;
};

export interface ControlPanelProps {
  onSelectZone: (zone: Zone) => void;
}
