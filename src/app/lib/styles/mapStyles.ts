import type { FillLayer, LayerProps, LineLayer } from "react-map-gl";

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const appbZonesLayer: FillLayer = {
  id: "appb-zones-layer",
  source: "appb-zones-source",
  type: "fill",
  paint: {
    "fill-color": "#c0dac8",
    "fill-opacity": 0.8,
  },
};

export const appbZonesBorderLayer: LineLayer = {
  id: "appb-zones-border-layer",
  type: "line",
  paint: {
    "line-color": "gray",
    "line-width": 2,
  },
};

export const logoLayer: LayerProps = {
  id: "logo-layer",
  type: "symbol",
  source: "appb-zones-source",
  layout: {
    "icon-image": "logo",
    "icon-size": 0.1,
    "icon-allow-overlap": true,
    "icon-anchor": "bottom", // Adjust anchor if necessary
    "icon-offset": [0, -15], // Adjust offset if necessary
  },
};
