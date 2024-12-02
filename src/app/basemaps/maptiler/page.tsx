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
} from "react-map-gl/maplibre";

import { useViewState, useMapStoreActions } from "@/app/lib/stores/mapStore";
import { useMaptilerMapId } from "@/app/lib/stores/mapFilters";

import ControlPanel from "@/app/components/control-panel";
import { InfoPopup } from "@/app/components/InfoPopup";
import { MultiStepFormPopup } from "@/app/components/MultiStepFormPopup";

import { appbZonesLayer } from "@/app/lib/styles/mapStyles";

import APPB_DATA from "@/lib/data/geojson/appb_zones.json";
import { MaptilerCredentials } from "@/app/lib/types/api/Credentials";

export default function MapPage() {
  const [cursor, setCursor] = useState<string>("auto");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showMultiStepFormPopup, setShowMultiStepFormPopup] = useState(false);
  const [maptilerCredentials, setMaptilerCredentials] = useState<
    MaptilerCredentials | undefined
  >(undefined);

  const mapRef = useRef<MapRef | null>(null);
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();
  const maptilerMapId = useMaptilerMapId();

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

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

  useEffect(() => {
    console.log("credentials", maptilerCredentials);
  }, [maptilerCredentials]);

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
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const handleInfoPopupClose = () => {
    setShowInfoPopup(false);
    setShowMultiStepFormPopup(true);
  };

  const handleMultiStepFormPopupClose = () => {
    setShowMultiStepFormPopup(false);
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
    <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={cursor}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/${maptilerMapId}/style.json?key=${maptilerKey}`}
        interactiveLayerIds={["appb-zones-layer"]}
      >
        <Source id="appb-zones-source" type="geojson" data={APPB_DATA}>
          <Layer {...(appbZonesLayer as LayerProps)} />
        </Source>

        <ControlPanel onSelectZone={onSelectZone} />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {showInfoPopup && <InfoPopup onClose={handleInfoPopupClose} />}

        {showMultiStepFormPopup && (
          <MultiStepFormPopup onClose={handleMultiStepFormPopupClose} />
        )}
      </Map>
    </div>
  );
}
