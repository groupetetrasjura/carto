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

import {
  useViewState,
  useMapStoreActions,
  useLayersVisibility,
} from "@/app/lib/stores/mapStore";
import {
  useActiveMapBackground,
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
  ZQFSZonesLayer,
  ZQFSZonesBorderLayer,
} from "@/app/lib/styles/mapStyles";

import APPB_DATA from "@/lib/data/geojson/appb_zones.json";
import APPB_LOGO_DATA from "@/lib/data/geojson/appb_logo.json";
import PROTECTED_AREAS_DATA from "@/lib/data/geojson/aires_protegees_fusion.json";
import SWISS_PROTECTED_AREAS_DATA from "@/lib/data/geojson/dff_noirmont.json";
import ZQFS_DATA from "@/lib/data/geojson/zqfs_rnnhcj.json";
import allPathsData from "@/lib/data/geojson/authorized_paths_with_dates_zones_and_transport_modes.json";
import parkingsData from "@/lib/data/geojson/carparks.json";
import OTHER_APPB_DATA from "@/lib/data/geojson/other_protected_biotopes_250116.json";

import Image from "next/image";
import MapFiltersButtons from "./components/MapFiltersButtons";
import { Box } from "@mui/material";
import ZoneCardPopup from "@/app/components/ZoneCardPopup";
import { AuthorizedPathsCollection, IAPPBZone } from "@/app/lib/types/GeoJSON";
import {
  addColorsToFeatures,
  filterAuthorizedPathsData,
  getZonesBoundingBox,
} from "@/lib/utils";
import { Legend } from "@/app/components/Legend";
import { MaptilerCredentials } from "@/app/lib/types/api/Credentials";
import DownloadFormPopup from "@/app/components/DownloadFormPopup";
import { MapBackground } from "@/app/lib/types/mapFilters";
import { FeatureCollection, Geometry } from "geojson";
import { GeoJSONFeatureProperties } from "./lib/types/generics";

export default function MapPage() {
  const [cursor, setCursor] = useState<string>("auto");
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showZoneCardPopup, setShowZoneCardPopup] = useState(false);
  const [zoneCardTitle, setZoneCardTitle] = useState("");
  const { setCurrentStep, setShowMultiStepForm, setMaptilerMapIds } =
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
  const activeMapBackground = useActiveMapBackground();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedZones = useMapFiltersSelectedZones();
  const selectedDate = useMapFiltersSelectedDate();
  const layersVisibility = useLayersVisibility();

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
        if (data.maptilerMapIds) {
          setMaptilerMapIds(data.maptilerMapIds);
        }
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
        alert(
          "Erreur lors de la récupération des identifiants de connexion pour les fonds de cartes. Veuillez contacter l'administrateur du site."
        );
      }
    };

    fetchCredentials();
  }, [setMaptilerMapIds]);

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

  const filteredFeatures = PROTECTED_AREAS_DATA.features.filter((feature) => {
    const typeCode = feature.properties.type_code;
    return (
      (typeCode === "RNR" && layersVisibility["protected-areas-source"].RNR) ||
      (typeCode === "ENS" && layersVisibility["protected-areas-source"].ENS) ||
      (typeCode === "RNN" && layersVisibility["protected-areas-source"].RNN)
    );
  });

  const addIGNSourceAndLayer = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
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
      );
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (viewState.zoom > 12 || activeMapBackground === MapBackground.IGN) {
      addIGNSourceAndLayer();
    } else {
      if (map.getLayer("ign-layer")) {
        map.removeLayer("ign-layer");
      }
      if (map.getSource("ign-source")) {
        map.removeSource("ign-source");
      }
    }
  }, [addIGNSourceAndLayer, viewState.zoom, activeMapBackground]);

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

  useEffect(() => {
    const zones = [...selectedZones];
    const bboxZones = getZonesBoundingBox(
      APPB_DATA as FeatureCollection<
        Geometry,
        GeoJSONFeatureProperties & IAPPBZone
      >,
      zones
    );
    mapRef.current?.getMap().fitBounds(
      [
        [bboxZones[0], bboxZones[1]], // Southwest coordinates
        [bboxZones[2], bboxZones[3]], // Northeast coordinates
      ],
      {
        padding: 50,
        duration: 1000,
      }
    );
  }, [selectedZones]);

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
          mapStyle={
            maptilerMapId !== null
              ? `https://api.maptiler.com/maps/${maptilerMapId}/style.json?key=${maptilerCredentials?.maptilerApiKey}`
              : `https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/classique.json`
          }
          interactiveLayerIds={["appb-zones-layer", "other-appb-zones-layer"]}
          attributionControl={false}
        >
          {layersVisibility["zonages-zqfs-source"] && (
            <Source id="zonages-zqfs-source" type="geojson" data={ZQFS_DATA}>
              <Layer {...(ZQFSZonesLayer as LayerProps)} />
              <Layer {...(ZQFSZonesBorderLayer as LayerProps)} />
            </Source>
          )}
          {layersVisibility["protected-areas-source"] && (
            <Source
              id="protected-areas-source"
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: filteredFeatures,
              }}
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
          )}
          {layersVisibility["swiss-protected-areas-source"] && (
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
                  "text-field": "District franc fédéral Le Noirmont",
                  "text-font": ["Open Sans Regular"],
                  "text-size": 12,
                  "text-anchor": "center",
                  "text-allow-overlap": false,
                  "text-max-width": 8,
                }}
              />
            </Source>
          )}
          <Source id="appb-zones-source" type="geojson" data={APPB_DATA}>
            <Layer {...(appbZonesLayer as LayerProps)} />
            <Layer {...(appbZonesBorderLayer as LayerProps)} />
          </Source>
          {layersVisibility["other-appb-source"] && (
            <Source
              id="other-appb-source"
              type="geojson"
              data={OTHER_APPB_DATA}
            >
              <Layer {...(otherAppbZonesLayer as LayerProps)} />
              <Layer {...(otherAppbZonesBorderLayer as LayerProps)} />
            </Source>
          )}
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
            onDownload={() => console.log("downloading....")}
          />

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
