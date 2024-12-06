"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as React from "react";
import { useRef, useCallback, useState, useEffect } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  MapRef,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  LayerProps,
  Marker,
} from "react-map-gl/maplibre";

import { useViewState, useMapStoreActions } from "@/app/lib/stores/mapStore";
import {
  useMapFiltersActions,
  useMapFiltersSelectedDate,
  useMapFiltersSelectedTransport,
  useMapFiltersSelectedZones,
  useMapFiltersShowMultiStepForm,
  useMaptilerMapId,
} from "@/app/lib/stores/mapFilters";

import ControlPanel from "@/app/components/control-panel";
import { InfoPopup } from "@/app/components/InfoPopup";
import { MultiStepFormPopup } from "@/app/components/MultiStepFormPopup";

import {
  appbZonesBorderLayer,
  appbZonesLayer,
  pathsLayer,
} from "@/app/lib/styles/mapStyles";

import APPB_DATA from "@/lib/data/geojson/appb_zones.json";
import APPB_LOGO_DATA from "@/lib/data/geojson/appb_logo.json";
import allPathsData from "@/lib/data/geojson/authorized_paths_with_dates_zones_and_transport_modes.json";

import Image from "next/image";
import MapFiltersButtons from "./components/MapFiltersButtons";
import { Box } from "@mui/material";
import ZoneCardPopup from "./components/ZoneCardPopup";
import { AuthorizedPathsCollection } from "./lib/types/GeoJSON";
import { addColorsToFeatures, filterAuthorizedPathsData } from "./lib/utils";
import { Legend } from "./components/Legend";
import { MaptilerCredentials } from "./lib/types/api/Credentials";

export default function MapPage() {
  const [cursor, setCursor] = useState<string>("auto");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showZoneCardPopup, setShowZoneCardPopup] = useState(false);
  const [zoneCardTitle, setZoneCardTitle] = useState("");
  const { setCurrentStep, setShowMultiStepForm, setMaptilerMapId } =
    useMapFiltersActions();
  const showMultiStepFormPopup = useMapFiltersShowMultiStepForm();
  const [maptilerCredentials, setMaptilerCredentials] = useState<
    MaptilerCredentials | undefined
  >(undefined);
  const [filteredData, setFilteredData] =
    useState<AuthorizedPathsCollection | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();
  const maptilerMapId = useMaptilerMapId();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedZones = useMapFiltersSelectedZones();
  const selectedDate = useMapFiltersSelectedDate();

  const openMultiStepForm = (step: number) => {
    setShowMultiStepForm(true);
    setCurrentStep(step);
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch("/api/credentials");
        const data = await response.json();
        setMaptilerCredentials(data);
        if (data.maptilerMapId) {
          setMaptilerMapId(data.maptilerMapId);
        }
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    };

    fetchCredentials();
  }, [setMaptilerMapId]);

  const onSelectZone = useCallback(
    ({
      longitude,
      latitude,
      zoom,
    }: {
      longitude: number;
      latitude: number;
      zoom: number;
    }) => {
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        duration: 2000,
        zoom: zoom,
      });
    },
    []
  );

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);

  const handleInfoPopupClose = () => {
    setShowInfoPopup(false);
    setShowMultiStepForm(true);
  };

  const handleMultiStepFormPopupClose = () => {
    setShowMultiStepForm(false);
    setCurrentStep(1);
  };

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.properties.name) {
      setZoneCardTitle(feature.properties.name);
      setShowZoneCardPopup(true);
    }
  }, []);

  useEffect(() => {
    if (allPathsData) {
      const filtered = filterAuthorizedPathsData(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        allPathsData,
        selectedTransport,
        selectedZones,
        selectedDate
      );
      const coloredData = addColorsToFeatures(filtered);
      setFilteredData(coloredData);
    } else {
      setFilteredData(null);
    }
  }, [selectedTransport, selectedZones, selectedDate]);

  return (
    <Box style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}>
      {maptilerCredentials?.maptilerApiKey && (
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          cursor={cursor}
          style={{ width: "100%", height: "100%" }}
          mapStyle={`https://api.maptiler.com/maps/${maptilerMapId}/style.json?key=${maptilerCredentials?.maptilerApiKey}`}
          interactiveLayerIds={["appb-zones-layer"]}
          attributionControl={false}
        >
          <Source id="appb-zones-source" type="geojson" data={APPB_DATA}>
            <Layer {...(appbZonesLayer as LayerProps)} />
            <Layer {...(appbZonesBorderLayer as LayerProps)} />
          </Source>
          {filteredData && (
            <Source
              id="authorized-paths-source"
              type="geojson"
              data={filteredData}
            >
              <Layer {...(pathsLayer as LayerProps)} />
            </Source>
          )}
          {APPB_LOGO_DATA.features.length > 0 &&
            APPB_LOGO_DATA.features.map((feature, index) => (
              <Marker
                key={`marker-${index}`}
                longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
                style={{ cursor: "pointer" }}
              >
                <Image src="/logo.png" alt="Marker" width={24} height={24} />
              </Marker>
            ))}

          <ControlPanel onSelectZone={onSelectZone} />
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          <MapFiltersButtons openMultiStepForm={openMultiStepForm} />
          <Legend />
          <ZoneCardPopup
            open={showZoneCardPopup}
            onClose={() => {
              setShowZoneCardPopup(false);
            }}
            title={zoneCardTitle}
            onDownload={() => console.log("download....")}
          />

          {showInfoPopup && <InfoPopup onClose={handleInfoPopupClose} />}

          {showMultiStepFormPopup && (
            <MultiStepFormPopup onClose={handleMultiStepFormPopupClose} />
          )}
        </Map>
      )}
    </Box>
  );
}
