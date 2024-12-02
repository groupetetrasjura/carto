import type { FillLayer } from "react-map-gl";

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const appbZonesLayer: FillLayer = {
  id: "appb-zones-layer",
  source: "appb-zones-source",
  type: "fill",
  paint: {
    "fill-color": "#336600",
    "fill-opacity": 0.66,
  },
};
