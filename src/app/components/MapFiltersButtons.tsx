import React from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/DoNotDisturb";
import FindMyLocationIcon from "@mui/icons-material/MyLocation";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";

import {
  useMapFiltersActions,
  useMapFiltersSelectedDate,
  useMapFiltersSelectedTransport,
  useMapFiltersSelectedZones,
} from "@/app/lib/stores/mapFilters";
import { MapRef } from "react-map-gl/maplibre";
import { checkAuthorizedDate, isIOS } from "../lib/utils";
import dayjs from "dayjs";
import { TransportType } from "../lib/types/mapFilters";
import MoreActions from "./MoreActions";

const MapFiltersButtons = ({
  openMultiStepForm,
  mapRef,
}: {
  openMultiStepForm: (step: number) => void;
  mapRef: React.RefObject<MapRef>;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const selectedZones = useMapFiltersSelectedZones();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedDate = useMapFiltersSelectedDate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isTinyScreen = useMediaQuery("(max-width:374px)");
  const { clearMapFilters } = useMapFiltersActions();

  const findMyLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const map = mapRef.current?.getMap();
          if (map) {
            // Remove existing layers
            const existingMarker = map.getLayer("user-location-marker");
            const existingRadius = map.getLayer("user-location-radius");
            if (existingMarker) {
              map.removeLayer("user-location-marker");
              map.removeSource("user-location-marker");
            }
            if (existingRadius) {
              map.removeLayer("user-location-radius");
              map.removeSource("user-location-radius");
            }

            // Add accuracy radius circle with new source
            map.addSource("user-location-radius", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                properties: {},
              },
            });
            map.addLayer({
              id: "user-location-radius",
              type: "circle",
              source: "user-location-radius",
              paint: {
                "circle-radius": accuracy / 50, //NB: accuracy can vary greatly, radius should be handle more graciously
                "circle-color": "#007cbf",
                "circle-opacity": 0.2,
              },
            });

            // Add marker with new source
            map.addSource("user-location-marker", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                properties: {},
              },
            });
            map.addLayer({
              id: "user-location-marker",
              type: "circle",
              source: "user-location-marker",
              paint: {
                "circle-radius": 8,
                "circle-color": "#007cbf",
              },
            });

            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true,
            });
          }
        },
        (error) => {
          let errorMessage =
            "Une erreur est survenue lors de la géolocalisation.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Veuillez autoriser l'accès à votre position dans les paramètres de votre navigateur.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Votre position est actuellement indisponible.";
              break;
            case error.TIMEOUT:
              errorMessage = "La demande de géolocalisation a expiré.";
              break;
          }

          // Add custom message is user on ios
          if (isIOS()) {
            errorMessage +=
              "\n📍 Si vous utilisez un iPhone, activez la géolocalisation :\n" +
              '1️⃣ Appuyez sur "aA" dans la barre d’adresse.\n' +
              '2️⃣ Sélectionnez "Réglages du site web".\n' +
              '3️⃣ Allez dans "Localisation" et choisissez "Demander" ou "Autoriser".\n' +
              "4️⃣ Rechargez la page et réessayez.\n\n" +
              "👉 Si le problème persiste, vérifiez dans Réglages > Confidentialité et sécurité > Service de localisation que Safari ait accès à votre position.";
          }

          alert(errorMessage);
          //console.error("Geolocation error:", error);
        },
        options
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const renderTransportButtonLabel = () => {
    switch (selectedTransport) {
      case TransportType.CAR:
        return "Avec moteur";
      case TransportType.OUTDOOR:
        return "Sans moteur";
      default:
        return "Mode de déplacement";
    }
  };

  const renderTransportButtonIcon = () => {
    switch (selectedTransport) {
      case TransportType.CAR:
        return <DirectionsCarIcon />;
      case TransportType.OUTDOOR:
        return <DirectionsWalkIcon />;
      default:
        return <DirectionsWalkIcon />;
    }
  };
  return (
    <>
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
        <Tooltip title="Supprimer les filtres" placement="top">
          <Button
            variant="brownMain"
            startIcon={<CancelIcon />}
            onClick={() => clearMapFilters()} // Clear all filters
            sx={{
              "& .MuiButton-startIcon": {
                marginRight: "0px",
                marginLeft: "0px",
              },
              textTransform: "none",
              minWidth: "36px",
              padding: isTinyScreen
                ? "4px 6px"
                : isMobile
                ? "6px 8px"
                : "8px 12px",
            }}
          ></Button>
        </Tooltip>
        <Badge
          badgeContent={selectedZones.length}
          color="success"
          invisible={!Boolean(selectedZones.length > 0)}
        >
          <Button
            variant="brownMain"
            startIcon={<LandscapeIcon />}
            onClick={() => openMultiStepForm(0)} // Open form at step 1
            sx={{
              textTransform: "none",
              padding: isTinyScreen
                ? "4px 6px"
                : isMobile
                ? "6px 8px"
                : "8px 12px",
            }}
          >
            Massifs
          </Button>
        </Badge>
        <Badge
          badgeContent={<CheckIcon fontSize={"inherit"} />}
          color="success"
          invisible={!Boolean(selectedTransport)}
        >
          <Button
            variant="brownMain"
            startIcon={renderTransportButtonIcon()}
            onClick={() => openMultiStepForm(1)} // Open form at step 2
            sx={{
              textTransform: "none",
              padding: isTinyScreen
                ? "4px 6px"
                : isMobile
                ? "6px 8px"
                : "8px 12px",
            }}
          >
            {isMobile ? "Dépl." : renderTransportButtonLabel()}
          </Button>
        </Badge>
        <Badge
          badgeContent={
            checkAuthorizedDate(selectedDate as dayjs.Dayjs) ? (
              <CheckIcon fontSize={"inherit"} />
            ) : (
              <WarningIcon fontSize={"inherit"} />
            )
          }
          color={
            checkAuthorizedDate(selectedDate as dayjs.Dayjs)
              ? "success"
              : "warning"
          }
          invisible={!Boolean(selectedDate)}
        >
          <Button
            variant="brownMain"
            startIcon={<CalendarTodayIcon />}
            onClick={() => openMultiStepForm(2)} // Open form at step 3
            sx={{
              textTransform: "none",
              padding: isTinyScreen
                ? "4px 6px"
                : isMobile
                ? "6px 8px"
                : "8px 12px",
            }}
          >
            {selectedDate ? selectedDate?.format("DD/MM/YY") : "Date"}
          </Button>
        </Badge>
      </div>
      <div
        style={{ position: "absolute", bottom: isTablet ? 60 : 12, right: 12 }}
      >
        <IconButton
          onClick={() => findMyLocation()}
          sx={{
            color: "#725E51",
            backgroundColor: "white",
            padding: 2,
            "&:hover": {
              backgroundColor: "white", // No effect on hover
            },
          }}
        >
          <FindMyLocationIcon />
        </IconButton>
      </div>
      <MoreActions
        mapRef={
          mapRef as unknown as React.RefObject<import("react-map-gl").MapRef>
        }
      />
    </>
  );
};

export default MapFiltersButtons;
