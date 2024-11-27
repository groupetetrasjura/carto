'use client';

import * as React from 'react';
import Map, { NavigationControl }from 'react-map-gl/maplibre';
import { useViewState, useMapStoreActions } from '@/app/lib/stores/mapStore';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPage() {

    const viewState = useViewState();
    const { setViewState } = useMapStoreActions();
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}

