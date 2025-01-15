import React from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/DoNotDisturb";
import FindMyLocationIcon from "@mui/icons-material/MyLocation";
import { Tooltip, useMediaQuery } from "@mui/material";

import {
  useMapFiltersActions,
  useMapFiltersSelectedDate,
  useMapFiltersSelectedTransport,
  useMapFiltersSelectedZones,
} from "@/app/lib/stores/mapFilters";
import { MapRef } from "react-map-gl/maplibre";

const MapFiltersButtons = ({
  openMultiStepForm,
  mapRef,
}: {
  openMultiStepForm: (step: number) => void;
  mapRef: React.MutableRefObject<MapRef | null>;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const selectedZones = useMapFiltersSelectedZones();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedDate = useMapFiltersSelectedDate();
  const { clearMapFilters } = useMapFiltersActions();

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const map = mapRef.current?.getMap();
          if (map) {
            // Remove existing user location marker and radius if they exist
            const existingMarker = map.getLayer("user-location-marker");
            const existingRadius = map.getLayer("user-location-radius");
            if (existingMarker) map.removeLayer("user-location-marker");
            if (existingRadius) map.removeLayer("user-location-radius");

            // Add accuracy radius circle
            map.addLayer({
              id: "user-location-radius",
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                  properties: {},
                },
              },
              paint: {
                "circle-radius": accuracy,
                "circle-color": "#007cbf",
                "circle-opacity": 0.2,
              },
            });

            // Add marker at user location
            map.addLayer({
              id: "user-location-marker",
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                  properties: {},
                },
              },
              paint: {
                "circle-radius": 8,
                "circle-color": "#007cbf",
              },
            });

            // Fly to user location
            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true,
            });
          }
        },
        (error) => {
          console.log("Error getting location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        margin: "0 0.5rem",
        zIndex: 1000,
      }}
    >
      <Tooltip title="Trouver ma position" placement="top">
        <Button
          variant="brownMain"
          startIcon={<FindMyLocationIcon />}
          onClick={() => findMyLocation()} // Clear all filters
          sx={{
            "& .MuiButton-startIcon": { marginRight: "0px", marginLeft: "0px" },
            textTransform: "none",
            minWidth: "36px",
          }}
        ></Button>
      </Tooltip>
      <Badge
        badgeContent={<CheckIcon fontSize={"inherit"} />}
        invisible={!Boolean(selectedZones.length > 0)}
      >
        <Button
          variant="brownMain"
          startIcon={<LandscapeIcon />}
          onClick={() => openMultiStepForm(0)} // Open form at step 1
          sx={{ textTransform: "none" }}
        >
          Massifs
        </Button>
      </Badge>
      <Badge
        badgeContent={<CheckIcon fontSize={"inherit"} />}
        invisible={!Boolean(selectedTransport)}
      >
        <Button
          variant="brownMain"
          startIcon={<DirectionsWalkIcon />}
          onClick={() => openMultiStepForm(1)} // Open form at step 2
          sx={{ textTransform: "none" }}
        >
          {isMobile ? "Dépl." : "Mode de déplacement"}
        </Button>
      </Badge>
      <Badge
        badgeContent={<CheckIcon fontSize={"inherit"} />}
        invisible={!Boolean(selectedDate)}
      >
        <Button
          variant="brownMain"
          startIcon={<CalendarTodayIcon />}
          onClick={() => openMultiStepForm(2)} // Open form at step 3
          sx={{ textTransform: "none" }}
        >
          Date
        </Button>
      </Badge>
      <Tooltip title="Supprimer les filtres" placement="top">
        <Button
          variant="brownMain"
          startIcon={<CancelIcon />}
          onClick={() => clearMapFilters()} // Clear all filters
          sx={{
            "& .MuiButton-startIcon": { marginRight: "0px", marginLeft: "0px" },
            textTransform: "none",
            minWidth: "36px",
          }}
        ></Button>
      </Tooltip>
    </div>
  );
};

export default MapFiltersButtons;
