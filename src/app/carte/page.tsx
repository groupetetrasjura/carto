"use client";

import * as React from "react";
import {useRef, useCallback} from 'react';
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  MapRef
} from "react-map-gl/maplibre";
import { useViewState, useMapStoreActions } from "@/app/lib/stores/mapStore";
import "maplibre-gl/dist/maplibre-gl.css";
import ControlPanel from '@/app/components/control-panel';

export default function MapPage() {
  const mapRef = useRef<MapRef>();
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();
  // const publicTransportationLayer = {
  //   id: "public-transportation-layer",
  //   type: "raster",
  //   paint: {
  //     "raster-opacity": 0.8,
  //   },
  // };
  /// See: https://github.com/alex3165/react-mapbox-gl/issues/811#issuecomment-1084328288
  const GeoplateformeOrtho1980To1995Source = {
    type: "raster",
    tiles: [
      "https://data.geopf.fr/wms-r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=ORTHOIMAGERY.ORTHOPHOTOS.1980-1995&STYLES=&FORMAT=image/jpeg&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96"
    ],
    tileSize: 256,
    attribution:
      'Map tiles by <a target="_top" rel="noopener" href="https://geoservices.ign.fr/">IGN Géoservices</a>',
  };
  const GeoplateformeScanV2Source = {
    type: "raster",
    tiles: [
      "https://data.geopf.fr/wms-r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=663&HEIGHT=836&LAYERS=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLES=&FORMAT=image/jpeg&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96"
    ],
    tileSize: 256,
    attribution:
      'Map tiles by <a target="_top" rel="noopener" href="https://geoservices.ign.fr/">IGN Géoservices</a>',
  };

  const PublicTransportationSource = {
    type: "raster",
    tiles: [
      "https://wms.geo.admin.ch?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ch.bav.haltestellen-oev",
    ],
      tileSize: 256,
    attribution:
      'Map tiles by <a target="_top" rel="noopener" href="http://www.swisstopo.admin.ch">swisstopo</a>',
  };

  const onSelectZone = useCallback(({longitude, latitude}) => {
    mapRef.current?.flyTo({center: [longitude, latitude], duration: 2000, zoom: 15});
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
      >
        {/* <Source {...PublicTransportationSource}>
          <Layer
            id="public-transportation-layer"
            type="raster"
            source="public-transportation-source"
            paint={{ "raster-opacity": 0.8 }}
          />
        </Source> */}

        <Source id="geoplateforme-scan-v2-source" {...GeoplateformeScanV2Source}>
          <Layer
            id="geoplateforme-scan-v2-layer"
            type="raster"
            source="geoplateforme-scan-v2-source"
            paint={{ "raster-opacity": 1.0 }}
          />
        </Source>
        {/* <Source id="geoplateforme-ortho-1980-95-source" {...GeoplateformeOrtho1980To1995Source}>
          <Layer
            id="geoplateforme-ortho-1980-95-layer"
            type="raster"
            source="geoplateforme-ortho-1980-95-source"
            paint={{ "raster-opacity": 0.5 }}
          />
        </Source> */}
        <ControlPanel onSelectZone={onSelectZone} />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
      </Map>
    </div>
  );
}
