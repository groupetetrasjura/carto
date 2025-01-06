"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as React from "react";
import { useRef, useCallback } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl/maplibre";
import { useViewState, useMapStoreActions } from "@/app/lib/stores/mapStore";
import ControlPanel from "@/app/components/control-panel";

export default function MapPage() {
  const mapRef = useRef<MapRef | null>(null);
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();

  const IGNSource = {
    type: "raster",
    tiles: [
      `https://data.geopf.fr/private/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws&FORMAT=image%2Fjpeg&STYLE=normal`,
    ],
    tileSize: 256,
  };

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

  return (
    <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        // mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        interactiveLayerIds={["appb-zones-layer"]}
      >
        <Source id="ign-source" {...IGNSource} type="raster">
          <Layer
            id="ign-layer"
            type="raster"
            source="ign-source"
            paint={{ "raster-opacity": 1.0 }}
          />
        </Source>

        <ControlPanel
          handleMapSnapshot={() => console.log("handle map snapshot")}
        />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
      </Map>
    </div>
  );
}
