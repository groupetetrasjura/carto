"use client";

import * as React from "react";
import { useRef, useCallback, useState, useEffect } from "react";
import Map, {
  Source,
  Layer,
  MapRef,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  LayerProps,
  Marker,
  AttributionControl,
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

import { InfoPopup } from "@/app/components/InfoPopup";
import { MultiStepFormPopup } from "@/app/components/MultiStepFormPopup";

import {
  appbZonesBorderLayer,
  appbZonesLayer,
  otherAppbZonesBorderLayer,
  otherAppbZonesLayer,
  solidPathsLayer,
  dashedPathsLayer,
  protectedAreasLayer,
  protectedAreasBorderLayer,
  swissProtectedAreasBorderLayer,
  swissProtectedAreasLayer,
  gelZonesLayer,
  gelZonesBorderLayer,
} from "@/app/lib/styles/mapStyles";

import APPB_DATA from "@/lib/data/geojson/appb_zones.json";
import APPB_LOGO_DATA from "@/lib/data/geojson/appb_logo.json";
import PROTECTED_AREAS_DATA from "@/lib/data/geojson/aires_protegees_fusion.json";
import SWISS_PROTECTED_AREAS_DATA from "@/lib/data/geojson/dff_noirmont.json";
import ZONAGES_GEL_DATA from "@/lib/data/geojson/zonages_gel.json";
import allPathsData from "@/lib/data/geojson/authorized_paths_with_dates_zones_and_transport_modes.json";
import parkingsData from "@/lib/data/geojson/carparks.json";
import OTHER_APPB_DATA from "@/lib/data/geojson/other_protected_biotopes_250116.json";

import Image from "next/image";
import MapFiltersButtons from "./components/MapFiltersButtons";
import { Box } from "@mui/material";
import ZoneCardPopup from "./components/ZoneCardPopup";
import { AuthorizedPathsCollection } from "./lib/types/GeoJSON";
import { addColorsToFeatures, filterAuthorizedPathsData } from "./lib/utils";
import { Legend } from "./components/Legend2";
import { MaptilerCredentials } from "./lib/types/api/Credentials";
import DownloadFormPopup from "./components/DownloadFormPopup";
import { TransportType } from "./lib/types/mapFilters";
import MoreActions from "./components/MoreActions";

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

  const handleMapSnapshot = () => {
    mapRef.current?.getMap().triggerRepaint();
    mapRef.current?.getMap().once("render", async () => {
      const canvas = mapRef.current?.getMap().getCanvas();
      if (!canvas) return;

      // check webp support
      const isWebPSupported = () => {
        const elem = document.createElement("canvas");
        if (!!(elem.getContext && elem.getContext("2d"))) {
          return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
        }
        return false;
      };

      let imageDataUrl;
      let fileExtension;
      // use webp if supported
      if (isWebPSupported()) {
        imageDataUrl = await new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob as Blob);
            },
            "image/webp",
            0.9
          );
        });
        fileExtension = "webp";
      } else {
        // use jpeg format
        imageDataUrl = canvas.toDataURL("image/jpeg", 0.9); // Qualité JPEG à 90%
        fileExtension = "jpg";
      }
      const link = document.createElement("a");
      link.href = imageDataUrl as string;
      link.download = `map_snapshot.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Snapshot downloaded as ${fileExtension}`);
    });
  };

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    console.log("event", event.features);
    const feature = event.features && event.features[0];
    if (
      feature &&
      feature.properties.name &&
      feature.source === "appb-zones-source"
    ) {
      setZoneCardTitle(feature.properties.name);
      setShowZoneCardPopup(true);
    }
    if (
      feature &&
      feature.properties.URL_FICHE &&
      feature.source === "other-appb-source"
    ) {
      window.open(feature.properties.URL_FICHE, "_blank");
    }
  }, []);

  // Add this new function
  const addIGNSourceAndLayer = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    // Add source if it doesn't exist
    if (!map.getSource("ign-source")) {
      map.addSource("ign-source", {
        type: "raster",
        tiles: [
          `https://data.geopf.fr/private/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws&FORMAT=image%2Fjpeg&STYLE=normal`,
        ],
        tileSize: 256,
      });
    }

    if (!map.getLayer("ign-layer")) {
      map.addLayer(
        {
          id: "ign-layer",
          type: "raster",
          source: "ign-source",
          paint: {
            "raster-opacity": 1.0,
          },
        },
        "appb-zones-layer"
      ); // TODO: check if this layer is present in the map style
    }
  }, []);

  // You can call this function in useEffect or any other event handler
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (viewState.zoom > 12 && selectedTransport === TransportType.OUTDOOR) {
      addIGNSourceAndLayer();
    } else {
      // Remove IGN layer and source if they exist
      if (map.getLayer("ign-layer")) {
        map.removeLayer("ign-layer");
      }
      if (map.getSource("ign-source")) {
        map.removeSource("ign-source");
      }
    }
  }, [addIGNSourceAndLayer, viewState.zoom, selectedTransport]);

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
          interactiveLayerIds={["appb-zones-layer", "other-appb-zones-layer"]}
          attributionControl={false}
        >
          <Source
            id="zonages-gel-source"
            type="geojson"
            data={ZONAGES_GEL_DATA}
          >
            <Layer {...(gelZonesLayer as LayerProps)} />
            <Layer {...(gelZonesBorderLayer as LayerProps)} />
          </Source>
          <Source
            id="protected-areas-source"
            type="geojson"
            data={PROTECTED_AREAS_DATA}
          >
            <Layer {...(protectedAreasLayer as LayerProps)} />
            <Layer {...(protectedAreasBorderLayer as LayerProps)} />
            <Layer
              id="protected-areas-labels"
              type="symbol"
              paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1,
              }}
              layout={{
                "text-field": [
                  "concat",
                  ["get", "type_code"],
                  "\n",
                  ["get", "nom_site"],
                ],
                "text-font": ["Open Sans Regular"],
                "text-size": 12,
                "text-anchor": "center",
                "text-allow-overlap": false,
                "text-max-width": 8,
              }}
            />
          </Source>
          <Source
            id="swiss-protected-areas-source"
            type="geojson"
            data={SWISS_PROTECTED_AREAS_DATA}
          >
            <Layer {...(swissProtectedAreasLayer as LayerProps)} />
            <Layer {...(swissProtectedAreasBorderLayer as LayerProps)} />
            <Layer
              id="swiss-protected-areas-labels"
              type="symbol"
              paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1,
              }}
              layout={{
                "text-field": "Site fédéral de protection de faune Le Noirmont",
                "text-font": ["Open Sans Regular"],
                "text-size": 12,
                "text-anchor": "center",
                "text-allow-overlap": false,
                "text-max-width": 8,
              }}
            />
          </Source>
          <Source id="appb-zones-source" type="geojson" data={APPB_DATA}>
            <Layer {...(appbZonesLayer as LayerProps)} />
            <Layer {...(appbZonesBorderLayer as LayerProps)} />
          </Source>
          <Source id="other-appb-source" type="geojson" data={OTHER_APPB_DATA}>
            <Layer {...(otherAppbZonesLayer as LayerProps)} />
            <Layer {...(otherAppbZonesBorderLayer as LayerProps)} />
          </Source>
          {filteredData && (
            <Source
              id="authorized-paths-source"
              type="geojson"
              data={filteredData}
            >
              <Layer {...(solidPathsLayer as LayerProps)} />
              <Layer {...(dashedPathsLayer as LayerProps)} />
            </Source>
          )}
          {parkingsData.features.length > 0 &&
            parkingsData.features.map((feature, index) => (
              <Marker
                key={`parkings-marker-${index}`}
                longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
              >
                <Image
                  src="/icons/parking_marker.png"
                  alt="Parking Marker"
                  width={24}
                  height={24}
                />
              </Marker>
            ))}
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

          {/* <GeolocateControl position="bottom-right" /> */}
          <AttributionControl
            position="top-right"
            customAttribution={`<a href="https://groupe-tetras-jura.org/">© Groupe Tétras Jura</a>, IGN`}
            compact={true}
          />
          <MapFiltersButtons
            openMultiStepForm={openMultiStepForm}
            mapRef={mapRef}
          />
          <Legend />
          <ZoneCardPopup
            open={showZoneCardPopup}
            onClose={() => {
              setShowZoneCardPopup(false);
            }}
            title={zoneCardTitle}
            onDownload={() => console.log("download....")}
          />
          <MoreActions handleMapSnapshot={handleMapSnapshot} />

          {showInfoPopup && <InfoPopup onClose={handleInfoPopupClose} />}

          {showMultiStepFormPopup && (
            <MultiStepFormPopup onClose={handleMultiStepFormPopupClose} />
          )}
          <DownloadFormPopup />
        </Map>
      )}
    </Box>
  );
}
