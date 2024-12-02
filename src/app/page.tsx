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
  useMapFiltersShowMultiStepForm,
  useMaptilerMapId,
} from "@/app/lib/stores/mapFilters";

import ControlPanel from "@/app/components/control-panel";
import { InfoPopup } from "@/app/components/InfoPopup";
import { MultiStepFormPopup } from "@/app/components/MultiStepFormPopup";

import {
  appbZonesBorderLayer,
  appbZonesLayer,
} from "@/app/lib/styles/mapStyles";

import APPB_DATA from "@/lib/data/geojson/appb_zones.json";
import { MaptilerCredentials } from "@/app/lib/types/api/Credentials";
import Image from "next/image";
import MapFiltersButtons from "./components/MapFiltersButtons";
import center from "@turf/center";
import { Box } from "@mui/material";

export default function MapPage() {
  const [cursor, setCursor] = useState<string>("auto");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const { setCurrentStep, setShowMultiStepForm } = useMapFiltersActions();
  const showMultiStepFormPopup = useMapFiltersShowMultiStepForm();
  const [maptilerCredentials, setMaptilerCredentials] = useState<
    MaptilerCredentials | undefined
  >(undefined);

  const mapRef = useRef<MapRef | null>(null);
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();
  const maptilerMapId = useMaptilerMapId();

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
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    };

    fetchCredentials();
  }, []);

  const centroids = React.useMemo(() => {
    if (!APPB_DATA.features) return [];
    return APPB_DATA.features
      .map((feature) => {
        if (feature.geometry && feature.geometry.type === "MultiPolygon") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return center(feature.geometry);
        }
        return null;
      })
      .filter(Boolean);
  }, []);

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
    console.log(event);
    const feature = event.features && event.features[0];
    if (feature) {
      console.log("feature", feature);
      window.alert(
        `Clicked layer ${feature.layer.id} / Feature ${feature.properties.name}`
      ); // eslint-disable-line no-alert
    }
  }, []);

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
        >
          <Source id="appb-zones-source" type="geojson" data={APPB_DATA}>
            <Layer {...(appbZonesLayer as LayerProps)} />
            <Layer {...(appbZonesBorderLayer as LayerProps)} />
          </Source>
          {centroids.length > 0 &&
            centroids.map((centroid, index) => (
              <Marker
                key={`marker-${index}`}
                longitude={centroid?.geometry.coordinates[0] as number}
                latitude={centroid?.geometry.coordinates[1] as number}
                style={{ cursor: "pointer" }}
              >
                <Image src="/logo.png" alt="Marker" width={24} height={24} />
              </Marker>
            ))}

          <ControlPanel onSelectZone={onSelectZone} />
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          <MapFiltersButtons openMultiStepForm={openMultiStepForm} />

          {showInfoPopup && <InfoPopup onClose={handleInfoPopupClose} />}

          {showMultiStepFormPopup && (
            <MultiStepFormPopup onClose={handleMultiStepFormPopupClose} />
          )}
        </Map>
      )}
    </Box>
  );
}
