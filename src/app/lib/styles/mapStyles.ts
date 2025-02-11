import type { FillLayer, LayerProps, LineLayer } from "react-map-gl";

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const appbZonesLayer: FillLayer = {
  id: "appb-zones-layer",
  source: "appb-zones-source",
  type: "fill",
  paint: {
    "fill-color": "#009366",
    "fill-outline-color": "gray",
    "fill-opacity": 0.23,
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

export const otherAppbZonesLayer: FillLayer = {
  id: "other-appb-zones-layer",
  source: "other-appb-source",
  type: "fill",
  paint: {
    "fill-color": "#E6E6FA",
    "fill-opacity": 0.66,
  },
};
export const otherAppbZonesBorderLayer: LineLayer = {
  id: "other-appb-zones-border-layer",
  type: "line",
  paint: {
    "line-color": "#4B0082",
    "line-width": 1,
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

export const solidPathsLayer: LayerProps = {
  id: "solid-paths-layer",
  type: "line",
  source: "authorized-paths-source",
  paint: {
    "line-color": ["get", "color"],
    "line-width": 3,
    "line-opacity": 0.8,
  },
  filter: ["==", ["get", "dashed"], false],
};

export const dashedPathsLayer: LayerProps = {
  id: "dashed-paths-layer",
  type: "line",
  source: "authorized-paths-source",
  paint: {
    "line-color": ["get", "color"],
    "line-width": 3,
    "line-opacity": 0.8,
    "line-dasharray": ["literal", [2, 4]], // Pointillés fixes
  },
  filter: ["==", ["get", "dashed"], true],
};
