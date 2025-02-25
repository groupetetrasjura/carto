// Work in progress
// Define a generic GeoJSON Feature interface
export interface GeoJSONFeature<
  Properties = Record<string, unknown>,
  Geometry = { type: string; coordinates: [number, number][] }
> {
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

// Define a GeoJSON FeatureCollection interface
export interface GeoJSONFeatureCollection<
  Properties = Record<string, unknown>,
  Geometry = { type: string; coordinates: [number, number][] }
> {
  type: "FeatureCollection";
  features: GeoJSONFeature<Properties, Geometry>[];
}

// Example of a specific geometry type
export interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

// Properties type for authorized paths features
export interface AuthorizedPathProperties {
  fid: number;
  Période_autorisation: string;
  "Du 15/12 au 14/05": string;
  "Du 15/05 au 30/06": string;
  "Recommandé du 01/07 au 14/12": string | null;
  "Du 15/12 au 1er dim de mars": string | null;
  "Du 15/12 au 1er dimanche de mars": string | null;
  layer: string;
  start_day: number | null;
  start_month: number | null;
  end_day: number | null;
  end_month: number | null;
  zone_names: string;
  mode_transport: "outdoor" | "car" | "all";
}

//Properties type for APPB zones
export interface IAPPBZone {
  fid: number;
  name: string;
  area: number;
  perimeter: number;
}

// Type for authorized paths feature
export type AuthorizedPathFeature = GeoJSONFeature<
  AuthorizedPathProperties,
  {
    type: "LineString";
    coordinates: [number, number][];
  }
>;

// Type for the full authorized paths collection
export type AuthorizedPathsCollection = GeoJSONFeatureCollection<
  AuthorizedPathProperties,
  {
    type: "LineString";
    coordinates: [number, number][];
  }
>;
