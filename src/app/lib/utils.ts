import {
  AuthorizedPathProperties,
  AuthorizedPathsCollection,
  GeoJSONFeature,
} from "@/app/lib/types/GeoJSON";
import { Zone } from "./types/mapFilters";
import dayjs from "dayjs";

/**
 * Filters GeoJSON features based on transport mode, zones, and date
 * @param geojsonData The input GeoJSON data
 * @param modeTransport The transport mode to filter by
 * @param zoneNames The zones to filter by
 * @param selectedDate The selected date to filter by
 * @returns Filtered GeoJSON containing only features matching the criteria
 */
export function filterAuthorizedPathsData(
  geojsonData: AuthorizedPathsCollection,
  modeTransport: string | null,
  zoneNames: Zone[],
  selectedDate: string | null
): AuthorizedPathsCollection {
  if (!geojsonData || !geojsonData.features)
    return { type: "FeatureCollection", features: [] };

  const isTransportActive = modeTransport !== null;
  const isZoneActive = zoneNames.length > 0;
  const isDateActive = selectedDate !== null;

  let selectedDay: number, selectedMonth: number;
  if (isDateActive && selectedDate) {
    const date = dayjs(selectedDate);
    selectedDay = date.date();
    selectedMonth = date.month() + 1;
  }

  const zoneSet = new Set(zoneNames);

  return {
    type: "FeatureCollection",
    features: geojsonData.features.filter(
      (
        feature: GeoJSONFeature<
          AuthorizedPathProperties,
          { type: "LineString"; coordinates: [number, number][] }
        >
      ) => {
        if (
          isTransportActive &&
          feature.properties.mode_transport !== modeTransport
        )
          return false;
        if (isZoneActive && !zoneSet.has(feature.properties.zone_names as Zone))
          return false;

        if (isDateActive) {
          const { Période_autorisation } = feature.properties;
          if (Période_autorisation) {
            return isDateInPeriod(
              selectedDay,
              selectedMonth,
              Période_autorisation
            );
          }
        }

        return true;
      }
    ),
  };
}

function isDateInPeriod(day: number, month: number, period: string): boolean {
  // Convert period to lowercase
  const periodLower = period.toLowerCase();

  // check if period is between 15/12 - 14/05
  if (periodLower.includes("du 15/12 au 14/05")) {
    return (
      (month === 12 && day >= 15) || // Du 15 au 31 décembre
      (month >= 1 && month <= 4) || // De janvier à avril
      (month === 5 && day <= 14) // Du 1er au 14 mai
    );
  }
  // check if period is between 15/12 - 30/06
  if (periodLower.includes("du 15/12 au 30/06")) {
    return (
      (month === 12 && day >= 15) ||
      (month >= 1 && month <= 5) ||
      (month === 6 && day <= 30)
    );
  }

  // check if period is between 15/05 - 30/06
  if (periodLower.includes("du 15/05 au 30/06")) {
    return (month === 5 && day >= 15) || month === 6; // Du 15 au 31 mai ou tout le mois de juin
  }

  // check if period is between 15/12 - 01 sunday of march
  if (periodLower.includes("du 15/12 au 1er dimanche de mars")) {
    if (month === 12 && day >= 15) return true; // Du 15 au 31 décembre
    if (month === 1 || month === 2) return true; // Janvier et février complets
    if (month === 3) {
      // Calculer le premier dimanche de mars pour l'année en cours
      const year = new Date().getFullYear();
      const firstDayOfMarch = new Date(year, 2, 1);
      const daysUntilSunday = (7 - firstDayOfMarch.getDay()) % 7;
      const firstSundayOfMarch = daysUntilSunday + 1;

      return day <= firstSundayOfMarch;
    }
    return false;
  }

  // Si aucune période spécifique n'est reconnue, return true
  return true;
}

export function addColorsToFeatures(
  geojsonData: AuthorizedPathsCollection
): AuthorizedPathsCollection {
  return {
    ...geojsonData,
    features: geojsonData.features.map((feature) => {
      const period =
        feature.properties["Période_autorisation"]?.toLowerCase() || "";

      let color = "#000000"; // Default color (black) if no period matches
      if (period.includes("du 15/12 au 14/05")) {
        color = "#0288d1";
      } else if (period.includes("du 15/12 au 30/06")) {
        color = "#0F9D58";
      } else if (period.includes("du 15/05 au 30/06")) {
        color = "#F57C00";
      } else if (period.includes("du 15/12 au 1er dimanche de mars")) {
        color = "#673AB7";
      } else if (
        period.includes("non reglemente par l'appb") ||
        period.includes("si déneigé")
      ) {
        color = "#9E9E9E"; // Magenta pour les itinéraires autorisés sur les 3 périodes
      } else {
        console.log(
          "Période non reconnue :",
          feature.properties["Période_autorisation"]
        );
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          color, // Add the color property
        },
      };
    }),
  };
}
