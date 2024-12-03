import { AuthorizedPathsCollection } from "@/app/lib/types/GeoJSON";

/**
 * Filters GeoJSON features based on transport mode
 * @param geojsonData The input GeoJSON data
 * @param modeTransport The transport mode to filter by
 * @returns Filtered GeoJSON containing only features matching the transport mode
 */
export function filterAuthorizedPathsData(
  geojsonData: AuthorizedPathsCollection,
  modeTransport: string
) {
  // Create new GeoJSON structure
  const filteredGeoJSON = {
    type: "FeatureCollection",
    name: geojsonData.name,
    crs: geojsonData.crs,
    features: geojsonData.features.filter(
      (feature: any) => feature.properties.mode_transport === modeTransport
    ),
  };

  return filteredGeoJSON;
}
